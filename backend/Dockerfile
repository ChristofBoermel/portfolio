FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the TypeScript code
RUN npm run build

EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
