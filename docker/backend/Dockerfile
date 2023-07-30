FROM node:14.17.0-alpine

WORKDIR /home/node/app

COPY ./package.json /home/node/app/package.json
COPY ./package-lock.json /home/node/app/package-lock.json
COPY --from=ghcr.io/ufoscout/docker-compose-wait:latest /wait /wait

RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python

CMD ["npm", "install"]
CMD ["npm", "start"]
