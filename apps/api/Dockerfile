FROM node:22-slim AS deps
WORKDIR /app

COPY package.json            ./
COPY apps/api/package.json   apps/api/package.json
COPY apps/api/prisma         apps/api/prisma

RUN npm install --omit=dev \
 && npx prisma generate --schema=apps/api/prisma/schema.prisma

FROM node:22-slim AS builder
WORKDIR /app

COPY --from=deps /app/node_modules        ./node_modules
COPY --from=deps /app/apps/api/package.json  ./apps/api/package.json
COPY . .

WORKDIR /app/apps/api
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/api/dist       ./dist
COPY --from=deps    /app/node_modules        ./node_modules
COPY --from=builder /app/apps/api/prisma     ./prisma
COPY --from=builder /app/apps/api/package.json ./package.json

EXPOSE 4000
CMD ["npm","run","start"]
