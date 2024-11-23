# Dockerfile

FROM node:23-alpine3.19

RUN npm install -g pnpm

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

EXPOSE 4173
EXPOSE 5173

CMD ["pnpm", "run", "preview"]
