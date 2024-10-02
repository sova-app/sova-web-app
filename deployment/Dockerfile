FROM node:18.18-alpine


RUN mkdir -p /app

WORKDIR /app


COPY ./app/package*.json ./

RUN npm install
COPY ./app .
EXPOSE 8080
CMD npm run dev