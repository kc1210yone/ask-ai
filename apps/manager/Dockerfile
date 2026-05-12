FROM node:24 AS builder

WORKDIR /app

COPY ./.npmrc ./package-lock.json ./package.json ./
COPY ./apps/manager/package.json ./apps/manager/
COPY ./packages/db/package.json ./packages/db/

RUN npm ci -w @internal/manager --include-workspace-root

COPY ./apps/manager/src ./apps/manager/src
COPY ./apps/manager/next.config.mts ./apps/manager/postcss.config.mts ./apps/manager/tsconfig.json ./apps/manager/
COPY ./packages/db/prisma ./packages/db/prisma
COPY ./packages/db/src ./packages/db/src
COPY ./packages/db/prisma.config.mts ./packages/db/tsconfig.json ./packages/db/

RUN npm run build -w @internal/db
RUN npm run build -w @internal/manager

# FROM node:24-slim
#
# WORKDIR /app
#
# ENV NODE_ENV=production
#
# COPY --from=builder /app/package.json ./
# COPY --from=builder /app/apps/manager/package.json ./apps/manager/
# COPY --from=builder /app/packages/db/package.json ./packages/db/
#
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/packages/db/dist ./packages/db/dist
# COPY --from=builder /app/apps/manager/.next ./apps/manager/.next
# COPY --from=builder /app/apps/manager/public ./apps/manager/public
#
# USER node
#
# EXPOSE 3000
#
# CMD ["npm", "run", "start", "-w", "@internal/manager"]
