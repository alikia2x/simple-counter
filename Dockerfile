FROM oven/bun:alpine AS base
RUN mkdir /app
RUN chown bun:bun /app
WORKDIR /app
COPY main.ts .
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "main.ts" ]