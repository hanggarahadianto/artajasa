FROM node:20.8.1-alpine3.18 AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production

FROM node:20.8.1-alpine3.18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

FROM node:20.8.1-alpine3.18 AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodemonjs

COPY --from=builder --chown=nodemonjs:nodejs /app/ ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nodemonjs
CMD ["npm", "start"]
