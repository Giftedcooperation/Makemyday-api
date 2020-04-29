FROM node:10-alpine
WORKDIR /planna
COPY package.json .
RUN npm install
COPY . /planna
EXPOSE 5000
CMD ["node" , "app.js"]

