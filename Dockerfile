FROM node:22-alpine

WORKDIR /app

RUN mkdir -p /app/data

COPY package.json server.js index.html manifest.json sw.js ./
COPY css ./css
COPY js ./js
COPY icons ./icons

ENV NODE_ENV=production
ENV PORT=8080
ENV DB_PATH=/app/data/act.db

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT:-8080}/api/health || exit 1

CMD ["node", "--no-warnings", "server.js"]
