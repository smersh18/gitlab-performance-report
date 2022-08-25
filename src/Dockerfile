FROM node:3.16.22-alpine
ADD package.json package.json
RUN npm install
ADD . .
RUN npm run build