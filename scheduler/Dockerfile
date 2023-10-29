FROM node:19 AS deps
WORKDIR /app
COPY package.json .
RUN npm install 
FROM node:19 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build && npm cache clean --force
EXPOSE 3000
CMD ["npm" ,"run","start:dev"]