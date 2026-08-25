# Local development image only. Staging/production run on Vercel (see
# docs/ARCHITECTURE.md) - this Dockerfile exists purely so `docker compose up`
# gives every contributor an identical Node/toolchain without installing it
# on the host.
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
