FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts --force

COPY dist/ ./dist/
COPY server.js ./
COPY src/db/ ./src/db/
COPY src/engine/ ./src/engine/
COPY src/routes/ ./src/routes/
COPY docs/templates/ ./docs/templates/
COPY drizzle.config.js ./

ENV NODE_ENV=production

CMD ["node", "server.js"]
