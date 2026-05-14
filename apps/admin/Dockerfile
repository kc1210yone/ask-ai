FROM node:24 AS builder

ARG DATABASE_URL
ARG NEXT_PUBLIC_USER_POOL_ID
ARG NEXT_PUBLIC_USER_POOL_CLIENT_ID

WORKDIR /app

RUN curl -sSL -o ./tini https://github.com/krallin/tini/releases/download/v0.19.0/tini && \
  chmod +x ./tini

COPY ./apps/admin/package.json ./apps/admin/
COPY ./packages/db/package.json ./packages/db/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/admin --include-workspace-root

COPY ./packages/db/prisma ./packages/db/prisma
COPY ./packages/db/src ./packages/db/src
COPY ./packages/db/prisma.config.mts ./packages/db/tsconfig.json ./packages/db/
ENV DATABASE_URL=$DATABASE_URL
RUN npx -w @internal/db prisma generate && \
  npm run build -w @internal/db

COPY ./apps/admin/src ./apps/admin/src
COPY ./apps/admin/next.config.mts ./apps/admin/postcss.config.mts ./apps/admin/tsconfig.json ./apps/admin/
ENV NEXT_PUBLIC_USER_POOL_ID=$NEXT_PUBLIC_USER_POOL_ID \
  NEXT_PUBLIC_USER_POOL_CLIENT_ID=$NEXT_PUBLIC_USER_POOL_CLIENT_ID
RUN npm run build -w @internal/admin


FROM node:24-slim

WORKDIR /app

COPY ./apps/admin/package.json ./apps/admin/
COPY ./packages/db/package.json ./packages/db/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/admin --include-workspace-root --omit=dev

COPY ./apps/admin/next.config.mts ./apps/admin/
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/tini ./

ENV PORT=3000
USER node
ENTRYPOINT ["./tini", "--"]
CMD ["./node_modules/.bin/next", "start", "./apps/admin"]
