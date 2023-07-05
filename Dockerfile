FROM node:12.13-alpine

WORKDIR /application

COPY package*.json ./

RUN npm i

COPY . .

COPY ./dist ./dist
