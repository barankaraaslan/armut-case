FROM node
WORKDIR /code
COPY ./app/package*.json ./
RUN npm install

