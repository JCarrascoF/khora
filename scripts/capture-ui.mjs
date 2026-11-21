import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT, 'screenshots');
const SERVER_PORT = 18080;
const CDP_PORT = 19222;
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const CHROME_PROFILE = '/tmp/khora-chrome-capture-profile';
const BASE_URL = `http://127.0.0.1:${SERVER_PORT}/`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 0;
    this.pending = new Map();
  }

  async connect() {
    await new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    });
  }

  send(method, params = {}) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  async eval(expression) {
    const res = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }

  async setViewport(width, height, mobile = false, deviceScaleFactor = 2) {
    await this.send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor,
      mobile,
    });
  }

  async screenshot(filePath, { fullPage = true, viewportWidth = 1280, viewportHeight = 900 } = {}) {
    await sleep(200);
    let params = { format: 'png' };
    if (fullPage) {
      const metrics = await this.eval(`({
        width: Math.max(document.documentElement.scrollWidth, ${viewportWidth}),
        height: Math.max(document.documentElement.scrollHeight, ${viewportHeight})
      })`);
      params.captureBeyondViewport = true;
      params.clip = {
        x: 0,
        y: 0,
        width: metrics.width,
        height: Math.min(metrics.height, 4500),
        scale: 1,
      };
    }
    const { data } = await this.send('Page.captureScreenshot', params);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, Buffer.from(data, 'base64'));
  }

  close() {
    try {
      this.ws.close();
    } catch {}
  }
}

async function waitForHttp(url, timeoutMs = 15000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {}
    await sleep(200);
  }
  throw new Error(`Timeout esperando a ${url}`);
}

async function main() {
  await fs.rm(OUT_DIR, { recursive: true, force: true });
  await fs.rm(CHROME_PROFILE, { recursive: true, force: true });
  await fs.mkdir(OUT_DIR, { recursive: true });

  console.log(`[UI Capture] Iniciando servidor Khora en puerto ${SERVER_PORT}...`);
  const serverProc = spawn('node', ['--no-warnings', 'server/server.js'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(SERVER_PORT), HOST: '127.0.0.1', ENABLE_SQLITE: 'false' },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let chromeProc;
  let cdp;

  try {
    await waitForHttp(BASE_URL);
    console.log('[UI Capture] Servidor listo. Lanzando Chrome headless...');

    chromeProc = spawn(
      CHROME_PATH,
      [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        `--remote-debugging-port=${CDP_PORT}`,
        `--user-data-dir=${CHROME_PROFILE}`,
        '--window-size=1280,900',
        BASE_URL,
      ],
      { stdio: ['ignore', 'pipe', 'pipe'] }
    );

    await waitForHttp(`http://127.0.0.1:${CDP_PORT}/json/list`);
    const targets = await (await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`)).json();
    const pageTarget = targets.find((t) => t.type === 'page') || targets[0];
    if (!pageTarget?.webSocketDebuggerUrl) throw new Error('No se encontró target de página en CDP');

    cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');
    await cdp.setViewport(1280, 900, false, 2);

    await cdp.eval(`new Promise(resolve => {
      const check = () => {
        if (window.app && window.stateManager && document.getElementById('home-view')?.innerHTML.trim()) {
          resolve(true);
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    })`);

    await cdp.eval(`(() => {
      window.stateManager.seedDemoData();
      window.app.navigate('home');
    })()`);
    await sleep(400);

    const captured = [];
    const record = async (group, name, fileRel, options = {}) => {
      const fullPath = path.join(OUT_DIR, fileRel);
      await cdp.screenshot(fullPath, options);
      captured.push({ group, name, path: fileRel });
      console.log(`  📸 Capturado: ${fileRel}`);
    };

    // 1. Screens
    const navAndShot = async (view, name, fileRel, afterNavExpr = null) => {
      await cdp.eval(`window.app.navigate('${view}')`);
      await sleep(250);
      if (afterNavExpr) {
        await cdp.eval(afterNavExpr);
        await sleep(250);
      }
      await record('01-screens', name, fileRel, { fullPage: true, viewportWidth: 1280, viewportHeight: 900 });
    };

    await navAndShot('home', 'Inicio (Ahora mismo)', '01-screens/01-guia-inicio.png');

    await navAndShot('act-space', 'Espacio ACT - Paso 1: Emoción', '01-screens/02-espacio-act-step1.png', `
      (() => {
        const chip = document.querySelector('#act-space-view .emotion-chip, #act-space-view [data-emotion]');
        if (chip) chip.click();
      })()
    `);
    for (let step = 2; step <= 7; step++) {
      await cdp.eval(`window.espacioActApp.setStep(${step})`);
      await sleep(200);
      await record('01-screens', `Espacio ACT - Paso ${step}`, `01-screens/02-espacio-act-step${step}.png`, {
        fullPage: true,
        viewportWidth: 1280,
        viewportHeight: 900,
      });
    }

    await navAndShot('compass', 'Brújula de Valores - Paso 1', '01-screens/03-brujula-valores-step1.png');
    await cdp.eval(`(() => {
      if (window.brujulaValoresApp) {
        window.brujulaValoresApp.currentStep = 2;
        window.brujulaValoresApp.render();
        window.brujulaValoresApp.bindEvents();
      }
    })()`);
    await sleep(200);
    await record('01-screens', 'Brújula de Valores - Paso 2', '01-screens/03-brujula-valores-step2.png', {
      fullPage: true,
      viewportWidth: 1280,
      viewportHeight: 900,
    });

    await navAndShot('false-peace', 'Espejo Paz Falsa - Paso 1', '01-screens/04-paz-falsa-step1.png');
    for (let step = 2; step <= 4; step++) {
      await cdp.eval(`window.pazFalsaApp.setStep(${step})`);
      await sleep(200);
      await record('01-screens', `Espejo Paz Falsa - Paso ${step}`, `01-screens/04-paz-falsa-step${step}.png`, {
        fullPage: true,
        viewportWidth: 1280,
        viewportHeight: 900,
      });
    }

    await navAndShot('values', 'Yo - Mis Valores', '01-screens/05-perfil-valores.png');
    await navAndShot('bus', 'Yo - Mi Autobús', '01-screens/06-perfil-autobus.png');
    await navAndShot('patterns', 'Yo - Mis Patrones', '01-screens/07-radar-patrones.png');
    await navAndShot('therapy', 'Evolución - Cuaderno de Terapia', '01-screens/08-insight-terapia.png');
    await navAndShot('history', 'Evolución - Historial en Frío', '01-screens/09-insight-historial.png');
    await navAndShot('charts', 'Evolución - Gráficos y Hexaflex', '01-screens/10-insight-graficos.png');
    await navAndShot('activity', 'Evolución - Actividad Reciente', '01-screens/11-insight-actividad.png');
    await navAndShot('toolkit', 'Píldoras - Trucos Rápidos', '01-screens/12-pildoras-trucos.png');
    await navAndShot('readings', 'Píldoras - Estudio ACT', '01-screens/13-pildoras-estudio.png');

    // 2. Modals
    await cdp.eval(`window.app.navigate('home')`);
    await sleep(200);
    await cdp.eval(`document.getElementById('btn-settings').click()`);
    await sleep(200);
    await record('02-modals', 'Configuración - Apariencia', '02-modals/01-settings-apariencia.png', { fullPage: false });

    await cdp.eval(`document.querySelector('[data-settings-tab="privacidad"]').click()`);
    await sleep(200);
    await record('02-modals', 'Configuración - Privacidad', '02-modals/02-settings-privacidad.png', { fullPage: false });

    await cdp.eval(`document.querySelector('[data-settings-tab="datos"]').click()`);
    await sleep(200);
    await record('02-modals', 'Configuración - Datos y App', '02-modals/03-settings-datos.png', { fullPage: false });
    await cdp.eval(`window.app.closeModal()`);
    await sleep(200);

    await cdp.eval(`document.getElementById('btn-context-help').click()`);
    await sleep(200);
    await record('02-modals', 'Ayuda Contextual', '02-modals/04-help-context.png', { fullPage: false });
    await cdp.eval(`window.app.closeModal()`);
    await sleep(200);

    await cdp.eval(`document.getElementById('btn-footer-feedback').click()`);
    await sleep(200);
    await record('02-modals', 'Enviar Feedback', '02-modals/05-feedback.png', { fullPage: false });
    await cdp.eval(`window.app.closeModal()`);
    await sleep(200);

    await cdp.eval(`window.app.navigate('patterns')`);
    await sleep(200);
    await cdp.eval(`document.getElementById('btn-new-pattern')?.click()`);
    await sleep(200);
    await record('02-modals', 'Modal Nuevo Patrón', '02-modals/08-pattern-modal.png', { fullPage: false });
    await cdp.eval(`window.app.closeModal()`);

    // 3. Theme variations
    await cdp.eval(`window.app.navigate('home')`);
    const palettes = ['arcilla', 'musgo', 'sepia', 'niebla', 'custom'];
    for (const theme of ['light', 'dark']) {
      for (const palette of palettes) {
        await cdp.eval(`(() => {
          document.documentElement.setAttribute('data-theme', '${theme}');
          document.documentElement.setAttribute('data-palette', '${palette}');
        })()`);
        await sleep(150);
        await record(
          '03-themes-and-options',
          `Tema ${theme} + Paleta ${palette}`,
          `03-themes-and-options/01-theme-${theme}-${palette}.png`,
          { fullPage: false }
        );
      }
    }

    // 4. Mobile
    await cdp.eval(`(() => {
      document.documentElement.setAttribute('data-theme', 'light');
      document.documentElement.setAttribute('data-palette', 'arcilla');
    })()`);
    await cdp.setViewport(390, 844, true, 2);
    await sleep(200);
    const mobileViews = [
      ['home', 'Móvil - Inicio', '04-mobile/01-guia-inicio.png'],
      ['act-space', 'Móvil - Espacio ACT', '04-mobile/02-espacio-act.png'],
      ['values', 'Móvil - Mis Valores', '04-mobile/03-perfil-valores.png'],
      ['bus', 'Móvil - Mi Autobús', '04-mobile/04-perfil-autobus.png'],
      ['charts', 'Móvil - Gráficos y Hexaflex', '04-mobile/05-insight-graficos.png'],
    ];
    for (const [view, name, fileRel] of mobileViews) {
      await cdp.eval(`window.app.navigate('${view}')`);
      await sleep(250);
      await record('04-mobile', name, fileRel, { fullPage: true, viewportWidth: 390, viewportHeight: 844 });
    }

    // Gallery HTML
    const galleryHtml = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <title>Khōra — UI Visual Log & Gallery</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 24px; background: #f5f3ee; color: #222; }
    h1 { margin-top: 0; }
    .meta { color: #666; margin-bottom: 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 18px; margin-bottom: 32px; }
    figure { margin: 0; background: #fff; border: 1px solid #e2ddd3; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 6px rgba(0,0,0,0.04); }
    figure img { width: 100%; height: 240px; object-fit: cover; object-position: top; display: block; border-bottom: 1px solid #eee; }
    figcaption { padding: 10px 12px; display: flex; flex-direction: column; gap: 3px; font-size: 13px; }
    figcaption span { color: #777; font-size: 11px; font-family: ui-monospace, monospace; }
  </style>
</head>
<body>
  <h1>Khōra — UI Visual Log</h1>
  <p class="meta">Total capturas: ${captured.length} · Actualizado: ${new Date().toLocaleString('es-ES')}</p>
  <div class="grid">
    ${captured.map(it => `
      <figure>
        <a href="${it.path}" target="_blank"><img src="${it.path}" alt="${it.name}" loading="lazy" /></a>
        <figcaption><strong>${it.name}</strong><span>${it.path}</span></figcaption>
      </figure>
    `).join('')}
  </div>
</body>
</html>`;
    await fs.writeFile(path.join(OUT_DIR, 'index.html'), galleryHtml, 'utf8');

    console.log(`\n[UI Capture] ✅ Finalizado con éxito: ${captured.length} capturas en ${OUT_DIR}`);
  } finally {
    if (cdp) cdp.close();
    if (chromeProc) chromeProc.kill('SIGTERM');
    if (serverProc) serverProc.kill('SIGTERM');
    await fs.rm(CHROME_PROFILE, { recursive: true, force: true }).catch(() => {});
  }
}

main().catch((err) => {
  console.error('[UI Capture] Error fatal:', err);
  process.exit(1);
});
