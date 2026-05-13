FROM node:24 AS builder

ARG NEXT_PUBLIC_USER_POOL_ID
ARG NEXT_PUBLIC_USER_POOL_CLIENT_ID
ARG DATABASE_URL

WORKDIR /app

RUN curl -sSL -o ./tini https://github.com/krallin/tini/releases/download/v0.19.0/tini && \
  chmod +x ./tini

COPY ./apps/manager/package.json ./apps/manager/
COPY ./packages/db/package.json ./packages/db/
COPY ./.npmrc ./package-lock.json ./package.json ./

RUN npm ci -w @internal/manager --include-workspace-root

COPY ./apps/manager/src ./apps/manager/src
COPY ./apps/manager/next.config.mts ./apps/manager/postcss.config.mts ./apps/manager/tsconfig.json ./apps/manager/
COPY ./packages/db/prisma ./packages/db/prisma
COPY ./packages/db/src ./packages/db/src
COPY ./packages/db/prisma.config.mts ./packages/db/tsconfig.json ./packages/db/

ENV NEXT_PUBLIC_USER_POOL_ID=$NEXT_PUBLIC_USER_POOL_ID \
  NEXT_PUBLIC_USER_POOL_CLIENT_ID=$NEXT_PUBLIC_USER_POOL_CLIENT_ID \
  DATABASE_URL=$DATABASE_URL

RUN npx -w @internal/db prisma generate
RUN npm run build -w @internal/db
RUN npm run build -w @internal/manager

FROM node:24-slim

WORKDIR /app

COPY ./apps/manager/package.json ./apps/manager/
COPY ./packages/db/package.json ./packages/db/
COPY ./.npmrc ./package-lock.json ./package.json ./

RUN npm ci -w @internal/manager --include-workspace-root --omit=dev

COPY ./apps/manager/next.config.mts ./apps/manager/
COPY --from=builder /app/apps/manager/.next ./apps/manager/.next
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/tini ./

ENV PORT=3000

USER node

ENTRYPOINT ["./tini", "--"]
CMD ["./node_modules/.bin/next", "start", "./apps/manager"]
