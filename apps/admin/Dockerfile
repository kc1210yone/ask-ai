FROM node:24 AS builder

ARG AWS_REGION
ARG NEXT_PUBLIC_USER_POOL_ID
ARG NEXT_PUBLIC_USER_POOL_CLIENT_ID

WORKDIR /app

RUN curl -sSL -o ./tini https://github.com/krallin/tini/releases/download/v0.19.0/tini && \
  chmod +x ./tini

COPY ./apps/admin/package.json ./apps/admin/
COPY ./packages/rdb/package.json ./packages/rdb/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/admin --include-workspace-root

COPY ./packages/rdb/prisma ./packages/rdb/prisma
COPY ./packages/rdb/src ./packages/rdb/src
COPY ./packages/rdb/prisma.config.mts ./packages/rdb/tsconfig.json ./packages/rdb/
RUN npx -w @internal/rdb prisma generate && \
  npm run build -w @internal/rdb

COPY ./apps/admin/src ./apps/admin/src
COPY ./apps/admin/next.config.mts ./apps/admin/postcss.config.mts ./apps/admin/tsconfig.json ./apps/admin/
ENV AWS_REGION=$AWS_REGION \
  NEXT_PUBLIC_USER_POOL_ID=$NEXT_PUBLIC_USER_POOL_ID \
  NEXT_PUBLIC_USER_POOL_CLIENT_ID=$NEXT_PUBLIC_USER_POOL_CLIENT_ID
RUN STRIPE_SECRET_KEY=dummy npm run build -w @internal/admin


FROM node:24-slim

WORKDIR /app

COPY ./apps/admin/package.json ./apps/admin/
COPY ./packages/rdb/package.json ./packages/rdb/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/admin --include-workspace-root --omit=dev

COPY ./apps/admin/next.config.mts ./apps/admin/
COPY --from=builder /app/apps/admin/.next ./apps/admin/.next
COPY --from=builder /app/packages/rdb/dist ./packages/rdb/dist
COPY --from=builder /app/tini ./

ENV PORT=3000
USER node
ENTRYPOINT ["./tini", "--"]
CMD ["./node_modules/.bin/next", "start", "./apps/admin"]
