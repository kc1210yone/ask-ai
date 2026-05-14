FROM node:24 AS builder

WORKDIR /app

COPY ./apps/functions/package.json ./apps/functions/
COPY ./packages/db/package.json ./packages/db/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/functions --include-workspace-root

COPY ./packages/db/prisma ./packages/db/prisma
COPY ./packages/db/src ./packages/db/src
COPY ./packages/db/prisma.config.mts ./packages/db/tsconfig.json ./packages/db/
RUN npx -w @internal/db prisma generate && \
  npm run build -w @internal/db

COPY ./apps/functions/src ./apps/functions/src
COPY ./apps/functions/tsconfig.json ./apps/functions/
RUN npm run build -w @internal/functions


FROM public.ecr.aws/lambda/nodejs:24

COPY ./apps/functions/package.json ./apps/functions/
COPY ./packages/db/package.json ./packages/db/
COPY ./.npmrc ./package-lock.json ./package.json ./
RUN npm ci -w @internal/functions --include-workspace-root --omit=dev

COPY --from=builder /app/apps/functions/dist ./apps/functions/dist
COPY --from=builder /app/packages/db/dist ./packages/db/dist

CMD [ "./dist/src/ingest/index.handler" ]
