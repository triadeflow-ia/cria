FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --omit=optional

COPY dist/ ./dist/
COPY server.js ./

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "server.js"]
