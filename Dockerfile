FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY tutorial-web-app/package.json tutorial-web-app/package-lock.json ./tutorial-web-app/
RUN npm ci --omit=dev --prefix tutorial-web-app
COPY . .
CMD ["node", "tutorial-web-app/server.js"]
