FROM node:16-alpine
WORKDIR /usr/app
COPY package.json .
RUN npm install --force
COPY . .
EXPOSE 5000
CMD ["npm", "run", "start:dev"]