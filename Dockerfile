FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npx nuxt build
CMD [ "npx", "nuxt", "start" ]