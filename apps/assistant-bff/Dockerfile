FROM node:24 AS builder

WORKDIR /app

RUN curl -sSL -o ./tini https://github.com/krallin/tini/releases/download/v0.19.0/tini && \
  chmod +x ./tini

COPY ./apps/assistant-bff/package.json ./apps/assistant-bff/
COPY ./packages/rdb/package.json ./packages/rdb/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/assistant-bff --include-workspace-root

COPY ./packages/rdb/prisma ./packages/rdb/prisma
COPY ./packages/rdb/src ./packages/rdb/src
COPY ./packages/rdb/prisma.config.mts ./packages/rdb/tsconfig.json ./packages/rdb/
RUN npx -w @internal/rdb prisma generate && \
  npm run build -w @internal/rdb

COPY ./apps/assistant-bff/src ./apps/assistant-bff/src
COPY ./apps/assistant-bff/tsconfig.json ./apps/assistant-bff/
RUN npm run build -w @internal/assistant-bff


FROM node:24-slim

WORKDIR /app

COPY ./apps/assistant-bff/package.json ./apps/assistant-bff/
COPY ./packages/rdb/package.json ./packages/rdb/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/assistant-bff --include-workspace-root --omit=dev

COPY --from=builder /app/apps/assistant-bff/dist ./apps/assistant-bff/dist
COPY --from=builder /app/packages/rdb/dist ./packages/rdb/dist
COPY --from=builder /app/tini ./

USER node
ENTRYPOINT ["./tini", "--"]
CMD ["node", "./apps/assistant-bff/dist/src/bootstrap/index.js"]
