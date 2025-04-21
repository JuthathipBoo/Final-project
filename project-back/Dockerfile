# backend/Dockerfile

FROM node:22-alpine

WORKDIR /app

# Copy package files and install dependencies with yarn
COPY package.json yarn.lock ./
RUN yarn install

# Copy all source files
COPY . .

# Install nodemon globally (if not in dependencies)
RUN yarn global add nodemon

# Expose port used by backend
EXPOSE 8750

# Run backend with nodemon
CMD ["yarn", "nodemon", "server.js"]

