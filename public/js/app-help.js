/**
 * Contextual Help Catalog & Modals Mixin for AppController.
 * Loaded immediately before public/js/app.js.
 */
(function (global) {
  global.KhoraAppHelpMixin = {
  getHelpCatalog() {
    return {
      screens: {
        'home': {
          title: 'Guía de Inicio — ¿Cómo estás ahora mismo?',
          time: '10 seg',
          does: 'Elegir cómo te encuentras ahora mismo para ir directo al ejercicio adecuado.',
          brings: 'Orientarte sin fricción según lo que necesites en este instante.',
          whenToUse: 'Es tu punto de entrada rápido según lo que necesites en este momento: atravesar un momento intenso o ganar perspectiva y entrenar.',
          steps: [
            '1. Elige una tarjeta de «Ahora mismo…» si notas un nudo o bucle, estás acelerado/a, dudas qué hacer o acabas de ceder.',
            '2. Usa la sección de «Perspectiva y práctica» para leer ideas breves, revisar tus valores o entrenar habilidades.'
          ],
          tip: 'En Khōra no hace falta rellenarlo todo ni entrar cada día: abre solo la herramienta que encaja contigo ahora.'
        },
        'act-space': {
          title:'El Espacio ACT — Procesar en 4 Pasos',
          time:'3 min',
          does: 'Nombrar la emoción, bajarla al cuerpo y desenganchar la mente.',
          brings: 'Bajar la intensidad del malestar y responder desde tus valores.',
          whenToUse: 'Úsalo cuando notes una emoción intensa (ansiedad, miedo, enfado, culpa o bloqueo) para atravesarla sin dejarte arrastrar.',
          steps: [
            '1. Nombrar Emoción: pon nombre exacto a lo que sientes (o salta directo al cuerpo si estás muy saturado/a).',
            '2. Sentir en el Cuerpo: ubica la sensación, descríbela y respira si quieres hacerle espacio.',
            '3. Tomar Distancia: observa el pensamiento que repite tu mente desde fuera, sin discutir con él.',
            '4. Elegir Micro-Paso: decide un gesto pequeño hacia tus valores (o registra si ganó el piloto automático).'
          ],
          tip: 'El objetivo no es suprimir la emoción ni sentir cero miedo, sino bajar la lucha y recuperar tu margen de elección.'
        },
        'false-peace': {
          title:'El Espejo de la Paz Falsa',
          time:'2 min',
          does: 'Contrastar qué querías decir vs. qué cediste por miedo.',
          brings: 'Medir el desgaste de callarte y detectar dónde poner límites.',
          whenToUse: 'Cuando acabas de callarte, pedir perdón de más o decir «sí» queriendo decir «no» para evitar una mala cara ajena.',
          steps: [
            '1. Anota dónde ocurrió y qué pedía la otra persona.',
            '2. Contrasta «lo que querías hacer realmente» frente a «lo que hiciste por fuera».',
            '3. Mide del 0 al 10 tu peaje real (resentimiento, agotamiento, ansiedad y vacío) para hacerlo visible.'
          ],
          tip: 'Nombrar la falsa paz no sirve para machacarte: tu resentimiento indica dónde te importa cuidar tus límites.'
        },
        'compass': {
          title:'La Brújula de Valores',
          time:'1 min',
          does: 'Pasar de «¿qué espera el otro?» a «¿qué elijo yo?».',
          brings: 'Una micro-acción clara para desbloquear tu decisión.',
          whenToUse: 'Antes de responder o tomar una decisión difícil, cuando dudas entre complacer al otro o ser fiel a lo que importa para ti.',
          steps: [
            '1. Resume en una línea la situación y marca qué miedo te frena ahora mismo.',
            '2. Elige el Valor que quieres representar como brújula (por encima del miedo inmediato).',
            '3. Fija una micro-acción concreta y honesta que dependa al 100% de ti.'
          ],
          tip: 'Pasa de «¿qué esperan que haga?» a «¿qué clase de persona elijo ser aquí?».'
        },
        'toolkit': {
          title:'Botiquín (Micro-Trucos)',
          time:'30-60 seg',
          does: 'Ejecutar una micro-técnica guiada paso a paso.',
          brings: 'Frenar el piloto automático en vivo.',
          whenToUse: 'Cuando necesitas frenar un impulso urgente en vivo (decir no, soltar culpa o bajar ansiedad).',
          steps: [
            '1. Elige la situación que más se parezca a este momento (cuerpo, mente o límites).',
            '2. Abre el ejercicio guiado paso a paso (Echar el Ancla, Silencio, Dos Flechas, Autobús ACT o Postura del SÍ).',
            '3. Síguelo en directo antes de contestar o decidir.'
          ],
          tip: 'Las pausas conscientes cortan el reflejo automático de justificarte.'
        },
        'readings': {
          title:'Lecturas y Ejercicios ACT (En Calma)',
          time:'2-3 min',
          does: 'Reencuadrar etiquetas rígidas, transformar dolor en anhelo y guardar mantras.',
          brings: 'Entrenar flexibilidad psicológica en frío sin sub-menús extra.',
          whenToUse: 'En momentos tranquilos para recordar ideas clave, desmontar etiquetas rígidas y ensanchar tu perspectiva.',
          steps: [
            '1. Revisa tus Tarjetas de Anclaje ACT o añade frases propias que quieras tener presentes en crisis.',
            '2. Usa el Deconstructor del «Yo Soy» para pasar de «soy egoísta/débil» a hechos concretos.',
            '3. Practica El Pivote para transformar un temor en el anhelo legítimo que esconde.'
          ],
          tip: 'Lo que entrenas en calma se vuelve accesible con mucho menos esfuerzo cuando llega la tormenta.'
        },
        'values': {
          title:'Mis Valores — Tu Brújula Vital',
          time:'2 min',
          does: 'Definir quién eliges ser en tus 5 ámbitos vitales y en qué conducta concreta se nota.',
          brings: 'Tener un Faro claro que guía toda la app cuando aparece la duda o el miedo.',
          whenToUse: 'Para definir quién eliges ser en tus áreas vitales (Pareja, Trabajo, Familia, Amistad, Conmigo Mismo).',
          steps: [
            '1. Pulsa cualquier ámbito o «+ Construir Valor» para crear tu frase con las 4 preguntas guía de Steven Hayes.',
            '2. Conviértelo en un pequeño gesto visible y nombra qué incomodidad estás dispuesto/a a sostener.',
            '3. Fija tu Valor Faro principal: guiará tu pantalla de inicio, tu Autobús ACT y tus crisis.'
          ],
          tip: 'Un valor no es un resultado ajeno («que me quieran»), sino una dirección continua («comunicar con afecto y honestidad»).'
        },
        'perfil-foco': {
          title:'Mi Foco Actual y Ruta Sugerida',
          time:'1 min',
          does: 'Anotar qué situación tienes en mente y qué barreras se te activan.',
          brings: 'Conectar tu bloqueo actual con tu valor de ese ámbito y ver qué herramienta encaja mejor.',
          whenToUse: 'Para situar qué tema te preocupa ahora, marcar qué barreras se te activan y ver qué ejercicio te ayuda más.',
          steps: [
            '1. A la izquierda escribe tu Foco actual, elige su ámbito y marca tus «Barreras que se te activan».',
            '2. A la derecha se calcula automáticamente tu «Hoja de Ruta Sugerida» con los ejercicios más afines.',
            '3. Pulsa cualquiera de las tarjetas sugeridas para ir directo a trabajarlo.'
          ],
          tip: 'Marcar las barreras no es una etiqueta negativa: es el filtro que le dice a la app qué ejercicio encaja mejor contigo.'
        },
        'patterns': {
          title:'El Radar de Patrones y Práctica de Opuestos',
          time:'3 min',
          does: 'Mapear un bucle que se repite y diseñar 1 micro-experimento semanal.',
          brings: 'Romper hábitos de complacencia con cambios pequeños y medibles.',
          whenToUse: 'Para estudiar en frío un bucle repetitivo (detonante → sumisión → falsa paz → coste) y probar un pequeño giro realista.',
          steps: [
            '1. Pulsa «+ Nuevo Patrón» y dibuja las 4 piezas del bucle junto con su ámbito.',
            '2. Elige 1 micro-experimento semanal usando los generadores de Práctica de Opuestos.',
            '3. Haz check-in cuando quieras para contrastar qué ocurrió en la realidad frente a lo que temía tu mente.'
          ],
          tip: 'Los cambios pequeños pero medibles rompen hábitos de complacencia mucho mejor que propósitos gigantes.'
        },
        'bus': {
          title:'Mi Autobús ACT y Radio Mental',
          time:'2 min',
          does: 'Identificar a tus pasajeros recurrentes (miedos y culpas) y sentarlos atrás sin pelear con ellos.',
          brings: 'Reconocer tus voces habituales al vuelo para que no giren tu volante.',
          whenToUse: 'Para poner nombre a tu «radio automática» y tener localizados los miedos que suelen intentar coger tu volante.',
          steps: [
            '1. Bautiza a tu mente pensante (ej. «George» o «Radio Catástrofe») para recordar que solo es un comentarista.',
            '2. Registra tus pasajeros recurrentes: qué gritan, de qué intentan protegerte y qué desvío te piden.',
            '3. Mándalos al asiento trasero sin pelear ni echarlos, y practica con el simulador.'
          ],
          tip: 'En ACT los miedos no desaparecen del autobús; aprendes a conducir hacia tus valores aunque sigan hablando atrás.'
        },
        'therapy': {
          title:'Cuaderno de Terapia',
          time:'1-2 min',
          does: 'Anotar reflexiones, bloqueos o avances entre sesiones y preparar un resumen clínico listo para copiar.',
          brings: 'Llegar a tu sesión de psicología con los temas importantes claros y ordenados.',
          whenToUse: 'Entre sesiones de psicología para anotar bucles, disparadores, dudas o pequeños logros que no quieres olvidar.',
          steps: [
            '1. Escribe lo que observaste (o usa un inicio rápido) y selecciona ámbito y tipo de apunte.',
            '2. La app extrae automáticamente emociones y procesos ACT/Hexaflex orientativos para sesión.',
            '3. Pulsa «Ver / Copiar Informe para mi Psicólogo» para llevar un resumen ordenado listo para compartir.'
          ],
          tip: 'Marca las reflexiones como «Tratadas en sesión» cuando ya las hayáis trabajado en consulta.'
        },
        'history': {
          title:'Historial en Frío y Consolidación',
          time:'2 min',
          does: 'Filtrar episodios pasados por emoción o ámbito y revisarlos en frío con perspectiva.',
          brings: 'Detectar patrones emocionales repetidos y convertir episodios difíciles en aprendizaje.',
          whenToUse: 'Para revisar episodios pasados (Espacio ACT y Paz Falsa), filtrarlos por emoción o ámbito y sacar aprendizajes.',
          steps: [
            '1. Filtra por emoción sentida (Miedo, Ira, Tristeza, Agotamiento…), ámbito o palabra clave.',
            '2. Abre «Valorar e Integrar en frío» en cualquier episodio para reflexionar qué pasó con perspectiva.',
            '3. Usa «Reflexionar sobre este patrón en Cuaderno de Terapia» para sintetizar varios episodios repetidos.'
          ],
          tip: 'Mirar en frío un episodio pasado transforma la culpa en aprendizaje práctico para la próxima vez.'
        },
        'charts': {
          title:'Gráficos y Perfil Hexaflex',
          time:'1 min',
          does: 'Revisar tu evolución, integrar episodios en frío y observar tendencias y tu perfil Hexaflex.',
          brings: 'Visión clara de tus avances para detectar patrones con curiosidad y compasión.',
          whenToUse: 'Para observar tendencias de intensidad, peaje de falsa paz, ámbitos con más sumisión y tu perfil Hexaflex.',
          steps: [
            '1. Evalúa de 0 a 10 los 6 procesos de flexibilidad psicológica en «Evaluar mi Hexaflex».',
            '2. Revisa si baja la intensidad en tus crisis y qué ocurre con tu resentimiento en el tiempo.',
            '3. Observa en el mapa de calor en qué contextos (Trabajo, Pareja, Familia…) cedes más a menudo.'
          ],
          tip: 'Los gráficos no buscan la perfección: ayudan a detectar patrones con curiosidad científica y compasión.'
        },
        'activity': {
          title:'Actividad Reciente y Micro-Victorias',
          time:'Consulta rápida',
          does:'Revisar tus últimos pasos en Khōra (foco, valores, barreras y pasajeros) y anotar micro-victorias.',
          brings: 'Ver tu constancia y tus pequeños avances cotidianos en un mismo sitio.',
          whenToUse:'Para repasar tus cambios recientes en Khōra o dejar apuntada una pequeña victoria o aprendizaje del día.',
          steps: [
            '1. Revisa la línea temporal de cambios en tu foco, valores, barreras y pasajeros.',
'2. Escribe una micro-victoria o aprendizaje rápido abajo y pulsa «Anotar».',
            '3. Vuelve aquí cuando necesites recordar todo lo que ya estás moviendo aunque cueste.'
          ],
          tip: 'La flexibilidad psicológica se construye con pequeños gestos repetidos, no con días perfectos.'
        },
        'guide': {
          title: 'Guía de uso de Khōra',
          time: '2 min',
          does: 'Recorrido breve en 5 secciones por Ahora mismo, Yo, Evolución, Aprender y Privacidad local.',
          brings: 'Orientación rápida para saber qué herramienta usar en cada momento y cómo guardar copias.',
          whenToUse: 'Cuando abras Khōra por primera vez o quieras repasar cómo funciona cada pestaña.',
          steps: [
            '1. Ahora mismo: herramientas para sostener el presente, frenar y elegir.',
            '2. Yo: tus valores, tu autobús de pasajeros, anclajes y patrones.',
            '3. Evolución: cuaderno de terapia, historial en frío y gráficos.',
            '4. Aprender: lecturas breves, introducción a ACT y talleres.',
            '5. Privacidad local y copias: todo se guarda en tu dispositivo con bloqueo y copias JSON.'
          ],
          tip: 'Puedes volver a abrir esta guía en cualquier momento desde Aprender o Configuración → Sobre Khōra.'
        }
      },
      topics: {
        'home': {
          title: '¿Cómo estás ahora mismo?',
          time: '10 seg',
          does: 'Elegir cómo te encuentras ahora mismo para ir directo al ejercicio adecuado.',
          brings: 'Orientarte sin fricción según lo que necesites en este instante.',
          summary: 'Es tu punto de entrada rápido según lo que necesites en este momento: atravesar un momento intenso o ganar perspectiva y entrenar.',
          bullets: [
            '1. Elige una tarjeta de «Ahora mismo…» si notas un nudo o bucle, estás acelerado/a, dudas qué hacer o acabas de ceder.',
            '2. Usa la sección de «Perspectiva y práctica» para leer ideas breves, revisar tus valores o entrenar habilidades.'
          ],
          note: 'En Khōra no hace falta rellenarlo todo ni entrar cada día: abre solo la herramienta que encaja contigo ahora.'
        },
        'act-space': {
          title:'El Espacio ACT — Procesar en 4 Pasos',
          time:'3 min',
          does: 'Nombrar la emoción, bajarla al cuerpo y desenganchar la mente.',
          brings: 'Bajar la intensidad del malestar y responder desde tus valores.',
          summary: 'Úsalo cuando notes una emoción intensa (ansiedad, miedo, enfado, culpa o bloqueo) para atravesarla sin dejarte arrastrar.',
          bullets: [
            '1. Nombrar Emoción: pon nombre exacto a lo que sientes (o salta directo al cuerpo si estás muy saturado/a).',
            '2. Sentir en el Cuerpo: ubica la sensación, descríbela y respira si quieres hacerle espacio.',
            '3. Tomar Distancia: observa el pensamiento que repite tu mente desde fuera, sin discutir con él.',
            '4. Elegir Micro-Paso: decide un gesto pequeño hacia tus valores (o registra si ganó el piloto automático).'
          ],
          note: 'El objetivo no es suprimir la emoción ni sentir cero miedo, sino bajar la lucha y recuperar tu margen de elección.'
        },
        fisicalizar: {
          title:'Fisicalizar la Sensación (Aceptación Somática)',
          time:'1 min',
          does: 'Ubicar la emoción en el cuerpo, describirla como un objeto físico y respirar haciéndole espacio.',
          brings: 'Dejar de pelear con la sensación física para que pierda rigidez.',
          summary: 'En vez de darle vueltas mentales a por qué sientes ansiedad o miedo, bajas la atención a tu cuerpo y describes la sensación como si fuera un objeto físico.',
          bullets: [
            '1. Marca dónde está en el cuerpo y qué forma o temperatura tendría.',
            '2. Respira «alrededor» de ella haciendo espacio en lugar de intentar apretar o huir.',
            '3. Usa la Postura Somática del «SÍ» (hombros sueltos, palmas abiertas) para avisar a tu sistema nervioso de que estás a salvo.'
          ],
          note: 'Cuando dejas de pelear con la sensación física, suele perder intensidad por sí sola.'
        },
        'defusion-act': {
          title:'Fórmulas de Distanciamiento (Defusión Cognitiva)',
          time:'1 min',
          does: 'Anteponer una frase de perspectiva para ver el pensamiento como palabras, no como una orden.',
          brings: 'Separarte del pensamiento automático para recuperar margen de elección.',
          summary: 'Cuando estamos fusionados con un pensamiento («soy egoísta»), lo vivimos como una verdad absoluta. La defusión restaura distancia.',
          bullets: [
            '• Notar el pensamiento: anteponer «Estoy teniendo el pensamiento de que…» lo convierte en un evento mental pasajero.',
            '• Historia de tu mente: ver «George me vuelve a contar la historia de que…» añade perspectiva y humor.',
            '• Agradecer sin obedecer: «Gracias, George, por intentar protegerme…» baja la lucha sin seguir la orden.'
          ],
          note: 'No hace falta discutir si el pensamiento es verdadero o falso: basta preguntarse si seguirlo te acerca a tus valores.'
        },
        'false-peace': {
          title:'El Espejo de la Paz Falsa',
          time:'2 min',
          does: 'Contrastar qué querías decir vs. qué cediste por miedo.',
          brings: 'Medir el desgaste de callarte y detectar dónde poner límites.',
          summary: 'Cuando acabas de callarte, pedir perdón de más o decir «sí» queriendo decir «no» para evitar una mala cara ajena.',
          bullets: [
            '1. Anota dónde ocurrió y qué pedía la otra persona.',
            '2. Contrasta «lo que querías hacer realmente» frente a «lo que hiciste por fuera».',
            '3. Mide del 0 al 10 tu peaje real (resentimiento, agotamiento, ansiedad y vacío) para hacerlo visible.'
          ],
          note: 'Nombrar la falsa paz no sirve para machacarte: tu resentimiento indica dónde te importa cuidar tus límites.'
        },
        'peaje-emocional': {
          title:'El Peaje Emocional de la Falsa Paz',
          time:'30 seg',
          does: 'Valorar del 0 al 10 cuánto resentimiento, agotamiento, ansiedad y vacío te dejó ceder.',
          brings: 'Hacer visible la factura interna de complacer y calcular tu Índice de Autoabandono.',
          summary: 'Ceder automáticamente suele traer alivio inmediato por fuera, pero cobra una factura física y emocional por dentro.',
          bullets: [
'Resentimiento, Agotamiento, Ansiedad y Vacío resumen el coste real de callar o complacer.',
'Su media alimenta el «Índice de Autoabandono» para que veas qué situaciones o contextos te desgastan más.'
          ],
          note: 'Reconocer este coste es el primer paso para elegir límites más cuidadosos contigo.'
        },
        'compass': {
          title:'La Brújula de Valores',
          time:'1 min',
          does: 'Pasar de «¿qué espera el otro?» a «¿qué elijo yo?».',
          brings: 'Una micro-acción clara para desbloquear tu decisión.',
          summary: 'Antes de responder o tomar una decisión difícil, cuando dudas entre complacer al otro o ser fiel a lo que importa para ti.',
          bullets: [
            '1. Resume en una línea la situación y marca qué miedo te frena ahora mismo.',
            '2. Elige el Valor que quieres representar como brújula (por encima del miedo inmediato).',
            '3. Fija una micro-acción concreta y honesta que dependa al 100% de ti.'
          ],
          note: 'Pasa de «¿qué esperan que haga?» a «¿qué clase de persona elijo ser aquí?».'
        },
        'nortes-recientes': {
          title:'Nortes Fijados Recientemente',
          time:'30 seg',
          does: 'Revisar las micro-acciones y valores que ya has elegido en dilemas recientes.',
          brings: 'Reforzar tu confianza recordando cómo ya has respondido desde tus valores.',
          summary: 'Es tu registro de decisiones tomadas con la Brújula de Valores.',
          bullets: [
            '• Cada tarjeta guarda la situación, el miedo que apareció, el valor elegido y tu micro-acción.',
            '• Revisarlo antes de una conversación difícil te recuerda que puedes actuar aunque haya miedo.'
          ],
          note: 'Cada micro-acción honesta suma dirección vital aunque el resultado externo no dependa de ti.'
        },
        'toolkit': {
          title:'Botiquín (Micro-Trucos)',
          time:'30-60 seg',
          does: 'Ejecutar una micro-técnica guiada paso a paso.',
          brings: 'Frenar el piloto automático en vivo.',
          summary: 'Cuando necesitas frenar un impulso urgente en vivo (decir no, soltar culpa o bajar ansiedad).',
          bullets: [
            '1. Elige la situación que más se parezca a este momento (cuerpo, mente o límites).',
            '2. Abre el ejercicio guiado paso a paso (Echar el Ancla, Silencio, Dos Flechas, Autobús ACT o Postura del SÍ).',
            '3. Síguelo en directo antes de contestar o decidir.'
          ],
          note: 'Las pausas conscientes cortan el reflejo automático de justificarte.'
        },
        'tarjetas-anclaje': {
          title:'Mis Tarjetas de Anclaje ACT',
          time:'30 seg',
          does: 'Guardar y repasar frases breves o mantras personales alineados con tus valores.',
          brings: 'Tener recordatorios rápidos a mano cuando aparece una ola emocional.',
          summary: 'Frases cortas de perspectiva ACT y recordatorios propios para tener a mano.',
          bullets: [
            '1. Desliza las tarjetas para leer tus anclajes guardados.',
            '2. Pulsa «+ Nuevo Anclaje» para escribir una frase tuya que te devuelva al presente.'
          ],
          note: 'Las mejores frases ancla no son positivismo forzado, sino recordatorios de aceptación y valores.'
        },
        'miniguias-bolsillo': {
          title:'Miniguías de Bolsillo (Lecturas Breves)',
          time:'1 min',
          does: 'Leer micro-reflexiones prácticas sobre defusión, límites y aceptación y abrir su truco guiado.',
          brings: 'Entrenar flexibilidad psicológica en calma para que sea accesible en crisis.',
          summary: 'Lecturas breves diseñadas para asimilar conceptos ACT en momentos tranquilos.',
          bullets: [
'1. Filtra por categoría (Defusión, Límites, Aceptación) o marca tus favoritas con .',
            '2. Abre cualquier píldora para leer el desglose completo.',
'3. Pulsa «Ejecutar truco guiado» para practicar la técnica asociada al instante.'
          ],
          note: 'Lo que entrenas en calma se vuelve accesible con mucho menos esfuerzo cuando llega la tormenta.'
        },
        'deconstructor-pivote': {
          title:'El Deconstructor del"Yo Soy"',
          time:'1 min',
          does: 'Desmontar una etiqueta fija en una conducta concreta y modificable.',
          brings: 'Soltar juicios absolutos sobre ti y recuperar margen de cambio.',
          summary: 'Dos prácticas breves en calma para flexibilizar juicios rígidos y transformar miedos en dirección valiosa.',
          bullets: [
'Deconstructor: transforma etiquetas globales («soy débil») en un pensamiento dentro de un contexto concreto y modificable.',
'El Pivote: en la otra cara de cada dolor o miedo hay algo legítimo que valoras (vínculo, respeto, descanso); aprende a cuidarlo con dignidad en vez de sumisión.'
          ],
          note: 'Puedes probar cualquiera tocando una plantilla arriba y guardarla adaptada a tus palabras.'
        },
        'el-pivote': {
          title:'El Pivote: Del Dolor al Anhelo',
          time:'1 min',
          does: 'Transformar lo que te duele o temes en el valor o anhelo legítimo que esconde.',
          brings: 'Cuidar lo que te importa con dignidad en lugar de sumisión.',
          summary: 'En ACT, detrás de cada miedo o culpa suele esconderse algo que te importa de verdad (vínculo, respeto, descanso).',
          bullets: [
            '1. Nombra qué te duele o qué temes que ocurra.',
            '2. Pregúntate qué anhelo sano o valor hay en la otra cara de ese dolor.',
            '3. Elige un gesto digno para honrar ese anhelo sin caer en la falsa paz.'
          ],
          note: 'Donde hay dolor hay algo que valoras: el pivote te devuelve la dirección sin luchar contra el miedo.'
        },
        'valores-faro': {
          title:'¿Qué es un Valor en ACT?',
          time:'2 min',
          does: 'Definir quién eliges ser en tus 5 ámbitos vitales y en qué conducta concreta se nota.',
          brings: 'Tener una brújula clara que guía toda la app cuando aparece la duda o el miedo.',
          summary: 'Según Steven Hayes, un valor es una dirección vital continua (como ir hacia el Oeste), nunca un destino que se tacha ni algo que dependa de otra persona.',
          bullets: [
'Valor (depende de ti): «Expresar mis necesidades con honestidad y calma».',
'Trampa de meta ajena (no depende de ti): «Conseguir que nunca se enfaden conmigo».',
'Micro-acción y Disposición: cada valor se aterriza en un gesto pequeño y en aceptar el pellizco de incomodidad que conlleva.'
          ],
          note: 'El valor que marques como «Valor Principal (Portada)» aparece destacado en Inicio y en momentos de crisis.'
        },
        'preguntas-guia-valores': {
          title:'Preguntas guía para descubrir valores (ACT)',
          time:'1 min',
          does: 'Usar 4 perspectivas clínicas de ACT para descubrir qué cualidad humana quieres encarnar en este ámbito.',
          brings: 'Salir del «¿qué debería hacer?» para conectar con lo que de verdad te importa.',
          summary: 'Son 4 preguntas clásicas de Terapia de Aceptación y Compromiso (Steven C. Hayes, Kelly Wilson y Russ Harris) pensadas para inspirarte antes de elegir semillas o escribir tu frase.',
          bullets: [
            '• Donde duele (Hayes): «Sufrimos donde nos importa»; detrás de tu frustración suele haber algo valioso que quieres cuidar.',
            '• Sin miedo ni culpa (Pregunta del milagro): cómo elegirías comportarte si el miedo al rechazo no decidiera hoy.',
            '• Tu huella (Wilson / Hayes): qué cualidad humana quieres que recuerden quienes te quieren.',
            '• Tu dignidad: qué acción te deja en paz contigo al mirarte al espejo.'
          ],
          note: 'No hace falta elegir ninguna: léelas solo para inspirarte y construye tu frase libremente.'
        },
        'perfil-foco': {
          title:'Mi Foco y Radar de Patrones',
          time:'1 min',
          does: 'Anotar qué situación tienes en mente y qué barreras se te activan.',
          brings: 'Conectar tu bloqueo actual con tu valor de ese ámbito y ver qué herramienta encaja mejor.',
          summary: 'Para situar qué tema te preocupa ahora, marcar qué barreras se te activan y mapear bucles repetitivos.',
          bullets: [
            '1. Arriba a la izquierda escribe tu Foco actual y marca tus «Barreras que se te activan».',
            '2. A la derecha se calcula automáticamente tu «Hoja de Ruta Sugerida» con los ejercicios más afines.',
            '3. Abajo, en «El Radar de Patrones», dibuja tus bucles repetitivos y define un micro-experimento semanal.'
          ],
          note: 'Marcar las barreras no es una etiqueta negativa: es el filtro que le dice a la app qué ejercicio encaja mejor contigo.'
        },
        'foco-situacion': {
          title:'¿Qué situación tienes en mente ahora?',
          time:'30 seg',
          does: 'Describir en una línea la situación o conversación que te preocupa y marcar su ámbito.',
          brings: 'Conectar tu preocupación actual con tu Valor Faro de ese ámbito y afinar tu ruta sugerida.',
          summary: 'Te ayuda a aterrizar una preocupación difusa en un contexto concreto (Pareja, Trabajo, Familia, Amigos).',
          bullets: [
            '1. Toca un chip rápido o escribe en una frase qué situación tienes presente.',
            '2. Selecciona el ámbito para ver al instante tu Valor Faro en esa área.',
            '3. Pulsa Guardar para que la Hoja de Ruta Sugerida adapte sus recomendaciones.'
          ],
          note: 'Puedes actualizar tu foco tantas veces como cambie tu semana.'
        },
        barreras: {
          title:'Barreras que se te activan — ¿Para qué sirven?',
          time:'15 seg',
          does: 'Marcar qué bloqueos internos (miedo al conflicto, culpa, urgencia de ceder, rumiación…) notas activos ahora.',
          brings: 'Alimentar la Hoja de Ruta Sugerida para recomendarte el ejercicio ACT más útil.',
          summary: 'Son los bloqueos psicológicos habituales (miedo al conflicto, culpa al poner límites, urgencia de ceder, rumiación…) que aparecen cuando intentas actuar según tus valores.',
          bullets: [
'Para qué sirven aquí: al activar uno o varios chips, Khōra los cruza con tu Foco actual y recalcula al instante tu «Hoja de Ruta Sugerida».',
'Ejemplo: si marcas «Culpa al cuidar mis límites», te priorizará herramientas de límites breves y el Espejo de la Paz Falsa.',
'También quedan reflejadas en tu resumen de progresión para detectar qué barrera te frena más a menudo.'
          ],
          note: 'No es un examen ni queda fijo: actívalas o desactívalas según lo que notes presente en tu momento actual.'
        },
        'hoja-ruta': {
          title:'Hoja de Ruta Sugerida — ¿Cómo se calcula?',
          time:'Instantáneo',
          does: 'Cruzar localmente tu Foco, tus barreras activas y tu Autobús ACT sin enviar datos fuera.',
          brings: 'Proponerte las herramientas ACT que mejor encajan con tu bloqueo actual.',
          summary: 'Es una recomendación local en tu propio navegador (sin IA externa ni servidores) basada en reglas transparentes.',
          bullets: [
'Si tienes pasajeros haciendo ruido junto al volante, sugiere primero el ejercicio del Autobús ACT.',
'Suma afinidad según las barreras que has marcado y las palabras clave de tu situación en «Mi Foco».',
'Conecta cada herramienta sugerida con el Valor Faro de ese ámbito para que recuerdes el «para qué».'
          ],
          note: 'Puedes ignorar cualquier sugerencia y entrar directamente al ejercicio que prefieras.'
        },
        'patterns': {
          title:'El Radar de Patrones y Práctica de Opuestos',
          time:'3 min',
          does: 'Mapear un bucle que se repite y diseñar 1 micro-experimento semanal.',
          brings: 'Romper hábitos de complacencia con cambios pequeños y medibles.',
          summary: 'Sirve para estudiar en frío un bucle que se repite una y otra vez y probar una pequeña variación conductual realista.',
          bullets: [
            '1. Dibuja las 4 piezas del bucle: Detonante → Respuesta automática → Alivio rápido (Falsa Paz) → Coste real después.',
            '2. Elige 1 micro-experimento para la semana (usando los generadores de Opuestos: variar tiempo, forma o postura).',
            '3. Haz check-in cuando quieras para registrar qué descubrió la experiencia frente a lo que predecía tu mente.'
          ],
          note: 'Los cambios pequeños pero medibles rompen hábitos de complacencia mucho mejor que propósitos gigantes.'
        },
        'autobus-act': {
          title:'La Metáfora del Autobús (Steven C. Hayes)',
          time:'2 min',
          does: 'Identificar a tus pasajeros recurrentes (miedos y culpas) y sentarlos atrás sin pelear con ellos.',
          brings: 'Reconocer tus voces habituales al vuelo para que no giren tu volante.',
          summary: 'Tú conduces el autobús de tu vida hacia tus valores. Tus miedos, dudas y culpas son pasajeros que suben contigo e intentan hacerte girar cuando gritan.',
          bullets: [
'Luchar o intentar echarlos suele obligarte a parar el autobús y discutir con ellos.',
'Obedecerlos («digo que sí para que se callen») te saca de tu ruta y acaba en Falsa Paz.',
'Maniobra ACT: escuchar de qué intentan protegerte, sentarlos en los asientos traseros y mantener las manos en el volante.'
          ],
          note: 'Bautizar a tu mente (ej. «George») ayuda a recordar que esa voz es ruido automático, no una orden.'
        },
        'resumen-progresion': {
          title:'Actividad Reciente y Micro-Victorias',
          time:'Consulta rápida',
          does:'Revisar tus últimos pasos en Khōra (foco, valores, barreras y pasajeros) y anotar micro-victorias.',
          brings: 'Ver tu constancia y tus pequeños avances cotidianos en un mismo sitio.',
          summary:'Un registro ligero de tus pasos recientes en Khōra.',
          bullets: [
            '• Muestra una línea temporal breve con tus últimos cambios de foco, valores, barreras y pasajeros.',
            '• Puedes anotar aprendizajes rápidos o micro-victorias del día.'
          ],
          note: 'La flexibilidad psicológica se construye con pequeños gestos repetidos, no con días perfectos.'
        },
        'cuaderno-terapia': {
          title:'Cuaderno de Terapia e Informe Clínico',
          time:'1-2 min',
          does: 'Anotar reflexiones, bloqueos o avances entre sesiones y preparar un resumen clínico listo para copiar.',
          brings: 'Llegar a tu sesión de psicología con los temas importantes claros y ordenados.',
          summary: 'Un bloc pensado para capturar entre sesiones lo que suele olvidarse al sentarse en consulta.',
          bullets: [
'Khōra detecta de forma local palabras clave emocionales y procesos del Hexaflex para sugerir focos de sesión.',
'El botón «Ver / Copiar Informe para mi Psicólogo» reúne indicadores, emociones frecuentes, pasajeros, valores y temas pendientes en texto plano listo para pegar.'
          ],
          note: 'Ningún dato sale de tu navegador a menos que tú copies o exportes el texto.'
        },
        'history': {
          title:'Historial en Frío y Consolidación',
          time:'2 min',
          does: 'Filtrar episodios pasados por emoción o ámbito y revisarlos en frío con perspectiva.',
          brings: 'Detectar patrones emocionales repetidos y convertir episodios difíciles en aprendizaje.',
          summary: 'Para revisar episodios pasados (Espacio ACT y Paz Falsa), filtrarlos por emoción o ámbito y sacar aprendizajes.',
          bullets: [
            '1. Filtra por emoción sentida (Miedo, Ira, Tristeza, Agotamiento…), ámbito o palabra clave.',
            '2. Abre «Valorar e Integrar en frío» en cualquier episodio para reflexionar qué pasó con perspectiva.',
            '3. Usa «Reflexionar sobre este patrón en Cuaderno de Terapia» para sintetizar varios episodios repetidos.'
          ],
          note: 'Mirar en frío un episodio pasado transforma la culpa en aprendizaje práctico para la próxima vez.'
        },
        'hexaflex-perfil': {
          title:'Perfil de Flexibilidad Psicológica (Hexaflex)',
          time:'1 min',
          does: 'Autoevaluar del 0 al 10 los 6 procesos ACT (Aceptación, Defusión, Presente, Yo Contexto, Valores y Acción).',
          brings: 'Visualizar qué proceso tienes más fuerte y cuál necesita entrenamiento suave.',
          summary: 'El Hexaflex de Steven Hayes resume las 6 habilidades que componen la flexibilidad psicológica.',
          bullets: [
            '1. Pulsa «Evaluar mi Hexaflex» para puntuar cómo te has sentido en cada proceso.',
            '2. El gráfico radar dibuja tu equilibrio actual entre aceptación, defusión, presencia y acción.',
            '3. Repítelo cada cierto tiempo para observar qué área se va fortaleciendo.'
          ],
          note: 'No hay puntuaciones buenas o malas: es un mapa orientativo para saber qué herramienta practicar.'
        },
        'tendencias-evolucion': {
          title:'Tendencias Emocionales y Evolución',
          time:'Consulta visual',
          does: 'Comparar en el tiempo la intensidad de tus olas emocionales frente al peaje de falsa paz y resentimiento.',
          brings: 'Observar con perspectiva cómo evoluciona tu margen de respuesta.',
          summary: 'Cruza en una sola gráfica tus sesiones de Espacio ACT y tus registros de Paz Falsa.',
          bullets: [
            '• Línea verde: intensidad emocional procesada en Espacio ACT.',
            '• Nodos cálidos y línea discontinua: peaje de autoabandono y resentimiento acumulado en Paz Falsa.'
          ],
          note: 'En ACT el progreso no es dejar de sentir emociones intensas, sino ceder menos al piloto automático.'
        },
        'mapa-calor-contextos': {
          title:'Mapa de Calor por Contextos (Sumisión Emocional)',
          time:'Consulta visual',
          does: 'Agrupar tus registros de Falsa Paz según el ámbito vital donde ocurrieron (Trabajo, Pareja, Familia…).',
          brings: 'Identificar en qué entorno te cuesta más poner límites.',
          summary: 'Muestra cuántos episodios de Falsa Paz se concentran en cada área de tu vida.',
          bullets: [
            '• Te permite ver de un vistazo si tu mayor desgaste está en Trabajo, Pareja, Familia o Amigos.',
            '• Úsalo para decidir en qué ámbito construir tu próximo Valor Faro o micro-experimento en el Radar.'
          ],
          note: 'Detectar el contexto donde más cedes te ayuda a preparar frases ancla específicas antes de entrar en él.'
        }
      }
    };
  },

  openHelpDrawer({ viewId = null, topicId = null, termKey = null } = {}) {
    const drawer = document.getElementById('help-drawer');
    const backdrop = document.getElementById('help-drawer-backdrop');
    if (!drawer || !backdrop) return false;

    const catalog = this.getHelpCatalog();
    const rawId = viewId || this.currentView || 'home';
    const resolvedId = this.resolveViewAlias ? this.resolveViewAlias(rawId) : rawId;
    const resolvedTopic = topicId && this.resolveViewAlias ? (catalog.topics[topicId] ? topicId : this.resolveViewAlias(topicId)) : topicId;
    const guide = (resolvedTopic && catalog.topics[resolvedTopic]) || catalog.screens[resolvedId] || catalog.screens['home'];
    const glossary = (typeof ACT_GLOSSARY !== 'undefined' && ACT_GLOSSARY) ? ACT_GLOSSARY : {};
    const focusedTerm = termKey && glossary[termKey] ? { key: termKey, ...glossary[termKey] } : null;
    const otherTerms = Object.entries(glossary).filter(([k]) => k !== termKey);

    const esc = (v) => (window.KhoraUtils?.escapeHtml ? window.KhoraUtils.escapeHtml(v) : String(v ?? ''));
    const stepsList = guide.steps || guide.bullets || [];

    drawer.innerHTML = `
      <div class="help-drawer-header">
        <div>
          <span class="badge" style="background: rgba(87, 139, 116, 0.14); color: var(--sage-700); margin-bottom: 4px; display: inline-block;">
            ${focusedTerm ? 'Concepto ACT' : 'Guía y conceptos ACT'}
          </span>
          <h3 class="card-title" style="margin: 0;">${esc(focusedTerm ? focusedTerm.title : guide.title)}</h3>
        </div>
        <button type="button" class="btn-icon" id="btn-help-drawer-close" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
      </div>

      <div class="help-drawer-body">
        ${focusedTerm ? `
          <div class="help-drawer-term-card is-focused">
            <p style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.55; margin: 0 0 8px;">${esc(focusedTerm.plain)}</p>
            <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45;">
              <strong>Ejemplo:</strong> ${esc(focusedTerm.example)}
            </div>
          </div>
          <hr style="border: none; border-top: 1px solid var(--border-subtle); margin: 14px 0;">
          <div style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 6px;">
            En esta pantalla: ${esc(guide.title)}
          </div>
        ` : ''}

        ${(guide.does || guide.brings) ? `
          <div class="flow-purpose-bar" style="margin-top: 6px; margin-bottom: 10px;">
            ${guide.does ? `<span class="flow-purpose-item"><strong>Qué haces:</strong> <span>${esc(guide.does)}</span></span>` : ''}
            ${guide.brings ? `<span class="flow-purpose-item"><strong>Qué aporta:</strong> <span>${esc(guide.brings)}</span></span>` : ''}
          </div>
        ` : ''}

        ${guide.whenToUse ? `<p class="card-subtitle" style="line-height: 1.5; color: var(--text-primary); margin-bottom: 10px;">${esc(guide.whenToUse)}</p>` : ''}
        ${guide.summary ? `<p class="card-subtitle" style="line-height: 1.5; color: var(--text-primary); margin-bottom: 10px;">${esc(guide.summary)}</p>` : ''}

        ${stepsList.length > 0 ? `
          <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.55; padding-left: 18px; margin: 0 0 12px;">
            ${stepsList.map(st => `<li style="margin-bottom: 5px;">${esc(st)}</li>`).join('')}
          </ul>
        ` : ''}

        ${(guide.tip || guide.note) ? `
          <div style="padding: 10px 13px; border-radius: var(--radius-md); background: rgba(87, 139, 116, 0.1); border-left: 3.5px solid var(--sage-500); font-size: 0.81rem; color: var(--text-primary); line-height: 1.48; margin-bottom: 14px;">
            <strong>Clave ACT:</strong> <span>${esc(guide.tip || guide.note)}</span>
          </div>
        ` : ''}

        ${otherTerms.length > 0 ? `
          <details class="help-drawer-glossary" ${focusedTerm ? '' : ''}>
            <summary style="cursor: pointer; font-size: 0.82rem; font-weight: 700; color: var(--text-secondary); padding: 6px 0;">
              Glosario ACT (${otherTerms.length} conceptos)
            </summary>
            <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 8px;">
              ${otherTerms.map(([k, entry]) => `
                <div class="help-drawer-term-card" data-glossary-key="${esc(k)}">
                  <div style="font-weight: 700; font-size: 0.83rem; color: var(--text-primary);">${esc(entry.title)}</div>
                  <div style="font-size: 0.8rem; color: var(--text-secondary); line-height: 1.45; margin-top: 2px;">${esc(entry.plain)}</div>
                </div>
              `).join('')}
            </div>
          </details>
        ` : ''}
      </div>
    `;

    backdrop.classList.remove('hidden');
    drawer.classList.remove('hidden');
    requestAnimationFrame(() => {
      backdrop.classList.add('visible');
      drawer.classList.add('visible');
    });

    const closeHandler = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      this.closeHelpDrawer();
    };

    backdrop.onclick = closeHandler;
    document.getElementById('btn-help-drawer-close')?.addEventListener('click', closeHandler);

    if (!this._helpDrawerEscBound) {
      this._helpDrawerEscBound = true;
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !drawer.classList.contains('hidden')) {
          this.closeHelpDrawer();
        }
      });
    }

    window.i18n?.localizeDOM?.(drawer);
    return true;
  },

  closeHelpDrawer() {
    const drawer = document.getElementById('help-drawer');
    const backdrop = document.getElementById('help-drawer-backdrop');
    if (!drawer || !backdrop) return;
    drawer.classList.remove('visible');
    backdrop.classList.remove('visible');
    setTimeout(() => {
      drawer.classList.add('hidden');
      backdrop.classList.add('hidden');
    }, 220);
  },

  openScreenHelpModal(viewId = null) {
    if (this.openHelpDrawer({ viewId })) return;
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const catalog = this.getHelpCatalog();
    const rawId = viewId || this.currentView || 'home';
    const resolvedId = this.resolveViewAlias ? this.resolveViewAlias(rawId) : rawId;
    const guide = catalog.screens[resolvedId] || catalog.screens['home'];

    modalBody.innerHTML = `
      <div id="help-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
            <span class="badge" style="background: rgba(87, 139, 116, 0.14); color: var(--sage-700); margin-bottom: 6px; display: inline-block;">
              Guía rápida de esta pantalla
            </span>
            <h3 class="card-title">${guide.title}</h3>
          </div>
          <button type="button" class="btn-icon" id="btn-help-close-x" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        <div style="margin-top: 12px; padding: 11px 13px; border-radius: var(--radius-md); background: var(--bg-surface-elevated); border: 1px solid var(--border-subtle); font-size: 0.84rem; color: var(--text-primary); line-height: 1.5;">
<strong>Cuándo usarla:</strong><span>${guide.whenToUse}</span>
        </div>

        <div style="margin-top: 12px; padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); background: var(--bg-surface);">
          <div style="font-size: 0.84rem; font-weight: 800; color: var(--text-primary); margin-bottom: 8px;">
            Cómo funciona paso a paso
          </div>
          <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.55; padding-left: 18px; margin: 0;">
            ${guide.steps.map(st => `<li style="margin-bottom: 5px;">${st}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top: 12px; padding: 10px 13px; border-radius: var(--radius-md); background: rgba(87, 139, 116, 0.1); border-left: 3.5px solid var(--sage-500); font-size: 0.81rem; color: var(--text-primary); line-height: 1.48;">
<strong>Clave ACT:</strong><span>${guide.tip}</span>
        </div>

        <div class="btn-group" style="margin-top: 16px; justify-content: flex-end;">
          <button type="button" class="btn-primary" id="btn-help-done">✓ Entendido</button>
        </div>
      </div>
    `;

    this.openModal('medium');
    document.getElementById('btn-help-close-x')?.addEventListener('click', () => this.closeModal());
    document.getElementById('btn-help-done')?.addEventListener('click', () => this.closeModal());
  },

  openTopicHelpModal(topicId) {
    if (this.openHelpDrawer({ topicId })) return;
    const modal = document.getElementById('app-modal');
    const modalBody = document.getElementById('modal-body');
    if (!modal || !modalBody) return;

    const catalog = this.getHelpCatalog();
    const topic = catalog.topics[topicId];
    if (!topic) {
      this.openScreenHelpModal(this.currentView);
      return;
    }

    modalBody.innerHTML = `
      <div id="help-topic-modal-root">
        <div class="flex-between" style="gap: 8px; align-items: flex-start;">
          <div>
            <span class="badge" style="background: rgba(87, 139, 116, 0.14); color: var(--sage-700); margin-bottom: 6px; display: inline-block;">
              ⓘ Ayuda contextual ACT
            </span>
            <h3 class="card-title">${topic.title}</h3>
          </div>
          <button type="button" class="btn-icon" id="btn-help-topic-x" aria-label="Cerrar" style="width: 34px; height: 34px; flex-shrink: 0;">✕</button>
        </div>

        ${(topic.does || topic.brings) ? `
          <div class="flow-purpose-bar" style="margin-top: 12px; margin-bottom: 10px;">
            ${topic.does ? `<span class="flow-purpose-item"><strong>Qué haces:</strong> <span>${topic.does}</span></span>` : ''}
            ${topic.brings ?`<span class="flow-purpose-item"><strong>Qué aporta:</strong><span>${topic.brings}</span></span>` :''}
          </div>
        ` : ''}

        <p class="card-subtitle mt-2" style="line-height: 1.5; color: var(--text-primary);">
          ${topic.summary}
        </p>

<div class="settings-section-block">
          <ul style="font-size: 0.82rem; color: var(--text-secondary); line-height: 1.55; padding-left: 18px; margin: 0;">
            ${topic.bullets.map(b => `<li style="margin-bottom: 5px;">${b}</li>`).join('')}
          </ul>
        </div>

        <div style="margin-top: 12px; padding: 10px 13px; border-radius: var(--radius-md); background: rgba(87, 139, 116, 0.1); border-left: 3.5px solid var(--sage-500); font-size: 0.81rem; color: var(--text-primary); line-height: 1.48;">
          ${topic.note}
        </div>

        <div class="btn-group" style="margin-top: 16px; justify-content: flex-end;">
          <button type="button" class="btn-primary" id="btn-help-topic-done">✓ Entendido</button>
        </div>
      </div>
    `;

    this.openModal('medium');
    document.getElementById('btn-help-topic-x')?.addEventListener('click', () => this.closeModal());
    document.getElementById('btn-help-topic-done')?.addEventListener('click', () => this.closeModal());
  }
  };
})(window);
