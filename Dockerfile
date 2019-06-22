FROM node:8-alpine

RUN mkdir /usr/app
WORKDIR /usr/app

COPY package.json yarn.lock ./
RUN yarn

COPY . ./

EXPOSE 4000
CMD yarn start
