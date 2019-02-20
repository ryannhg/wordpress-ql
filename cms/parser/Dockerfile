FROM node:10.15.0

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm install

CMD [ "npm", "run", "dev" ]
