FROM oven/bun:latest AS base
WORKDIR /usr/src/app

COPY package.json bun.lockb ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run build

# ENV NODE_ENV=production

# USER bun:bun
EXPOSE 4173
EXPOSE 5173

ENTRYPOINT [ "bun", "run", "preview" ]
