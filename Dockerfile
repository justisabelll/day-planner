# barely understand how this works

FROM oven/bun

WORKDIR /app

COPY package.json .
COPY bun.lockb .

RUN bun install --production

COPY src src
COPY tsconfig.json .
COPY tailwind.config.js .
COPY public public



ENV NODE_ENV production
CMD ["bun", "src/index.tsx"]

