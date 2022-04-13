FROM node

WORKDIR /backend

COPY ./package*.json ./

RUN npm install

COPY ./ ./

ENV SOCKET_PORT=3030

ENV SERVER_PORT=3000

ENV SERVER_URL=127.0.0.1

ENV PRINTER_URL=127.0.0.1

ENV PRINTER_PORT=8083

RUN npm run build

ENV NODE_ENV=production

CMD [ "npm", "start" ]

