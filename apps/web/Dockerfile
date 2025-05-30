FROM node:22-slim AS deps

WORKDIR /app

COPY package.json ./
COPY apps/web/package.json apps/web/package.json

RUN npm install --legacy-peer-deps

FROM node:22-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/package.json ./apps/web/package.json
COPY . .

WORKDIR /app/apps/web
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/web/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/public ./public
COPY --from=builder /app/apps/web/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]