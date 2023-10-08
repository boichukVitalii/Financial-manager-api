FROM node:18-alpine AS builder
WORKDIR /opt/app
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci
COPY . .
RUN npm run build
RUN npm prune --production

FROM node:18-alpine
COPY --from=builder /opt/app/node_modules ./node_modules
COPY --from=builder /opt/app/package*.json ./
COPY --from=builder /opt/app/dist ./dist
COPY --from=builder /opt/app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start:migrate:prod"]