FROM node:22-slim

# Install Yarn
RUN npm cache clean --force && npm install -g yarn --force

# Install nodemon globally
RUN npm install -g nodemon

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install

COPY . .

EXPOSE 5003

CMD ["npm", "run", "dev"]
