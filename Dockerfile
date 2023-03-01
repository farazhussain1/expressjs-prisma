# Use a Node.js runtime as the base image
FROM node:latest

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the app's dependencies
RUN npm install

#RUN npm install -g npx

RUN npx prisma migrate deploy

# Copy the rest of the app's files to the container
COPY . .

# Build the TypeScript app
RUN npm run build

RUN cp env-dev .env
RUN cat .env
# Expose the port on which the app will run
#EXPOSE 3000

# Start the app
#CMD ["npm", "start"]
