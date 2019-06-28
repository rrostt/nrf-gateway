FROM node:8-alpine

WORKDIR /src

RUN apk add --no-cache make gcc g++ python linux-headers udev

COPY lib /src/lib
COPY package.json /src/package.json
COPY package-lock.json /src/package-lock.json
COPY .env /src/.env

RUN npm install --production

CMD ["npm", "start"]