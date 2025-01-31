FROM node:22

WORKDIR /web

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8382
EXPOSE 8383

CMD ["npm", "start"]