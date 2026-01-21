FROM oven/bun:alpine AS base
WORKDIR /usr/src/app

COPY main.ts .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "main.ts" ]