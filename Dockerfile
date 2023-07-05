FROM node:16.13.1

WORKDIR /product-pricer-nodejs-backend
COPY package*.json ./
COPY tsconfig.json .
RUN npm install
RUN npm install typescript -g
COPY . .
RUN tsc
ENTRYPOINT ["node", "/product-pricer-nodejs-backend/build/src/app.js"]