FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY dist/ ./dist/
COPY server.js ./

ENV NODE_ENV=production

CMD ["node", "server.js"]
