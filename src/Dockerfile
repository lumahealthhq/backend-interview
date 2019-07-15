FROM node:latest
WORKDIR /src
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "/src/index.js"]