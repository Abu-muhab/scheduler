FROM node:19 AS deps
WORKDIR /app
COPY package.json .
RUN npm install 
FROM node:19 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD ["npm" ,"run","dev"]