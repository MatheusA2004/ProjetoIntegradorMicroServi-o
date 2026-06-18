FROM node:20-slim AS base
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
 
FROM base AS builder
 
COPY package*.json ./
RUN npm ci
 
COPY . .
 
RUN npx prisma generate
RUN npm run build
 
FROM base AS runner
ENV NODE_ENV=production
 
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma
 
EXPOSE 3002
 
CMD ["sh", "-c", "node dist/server.js"]
 