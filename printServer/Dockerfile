FROM node

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY ./ ./

ENV PORT=8083

RUN npm run build

ENV NODE_ENV=production

EXPOSE 8083

CMD ["npm", "start"]


