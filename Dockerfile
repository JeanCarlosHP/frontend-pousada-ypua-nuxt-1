FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

RUN npx nuxt build

ENTRYPOINT ["npx", "nuxt", "start"]