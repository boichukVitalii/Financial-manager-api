FROM node:18-alpine
WORKDIR /opt/app
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm ci
ADD . .
RUN npx prisma migrate dev --name "init"
RUN npm run build
RUN npm prune --production
CMD ["node", "./dist/main.js"]