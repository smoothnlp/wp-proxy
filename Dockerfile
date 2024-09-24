FROM node:18-bullseye-slim

USER node
WORKDIR /app

COPY --chown=node:node . .
RUN yarn install

CMD ["yarn", "serve"]

