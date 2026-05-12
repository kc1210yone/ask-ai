# FROM node:24 AS builder
FROM node:24

WORKDIR /app

COPY ./.npmrc ./package-lock.json ./package.json ./
COPY ./apps/manager/package.json ./apps/manager/
COPY ./packages/db/package.json ./packages/db/

# RUN npm ci -w @internal/manager --include-workspace-root
RUN npm ci -w @internal/manager

# COPY apps/manager ./apps/manager
# COPY packages/db ./packages/db
#
# RUN mkdir -p apps/manager/public
#
# RUN npm run build -w @internal/db
# RUN npm run build -w @internal/manager -- --webpack
#
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
