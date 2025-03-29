FROM node:22

WORKDIR /CMPSC421_LAB2

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]