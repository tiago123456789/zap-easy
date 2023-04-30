FROM node:18-alpine

COPY .  app/

WORKDIR app

COPY .env app/

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "./dist/main.js"]