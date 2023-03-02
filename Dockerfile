FROM node:latest

WORKDIR /app

COPY package*.json ./

# Install the app's dependencies
RUN npm install

COPY . .

RUN npx prisma generate

#below will be required if the migrations doesn't exist

#RUN npx prisma migrate deploy

# Build the TypeScript app

RUN npm run build

RUN cp env-dev .env

RUN cat .env

#CMD ["npm", "start"]
