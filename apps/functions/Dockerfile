FROM node:24 AS builder

WORKDIR /app

COPY ./apps/functions/package.json ./apps/functions/
COPY ./packages/rdb/package.json ./packages/rdb/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/functions --include-workspace-root

COPY ./packages/rdb/prisma ./packages/rdb/prisma
COPY ./packages/rdb/src ./packages/rdb/src
COPY ./packages/rdb/prisma.config.mts ./packages/rdb/tsconfig.json ./packages/rdb/
RUN npx -w @internal/rdb prisma generate && \
  npm run build -w @internal/rdb

COPY ./apps/functions/src ./apps/functions/src
COPY ./apps/functions/tsconfig.json ./apps/functions/
RUN npm run build -w @internal/functions


FROM public.ecr.aws/lambda/nodejs:24

COPY ./apps/functions/package.json ./apps/functions/
COPY ./packages/rdb/package.json ./packages/rdb/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/functions --include-workspace-root --omit=dev

COPY --from=builder /app/apps/functions/dist ./apps/functions/dist
COPY --from=builder /app/packages/rdb/dist ./packages/rdb/dist
