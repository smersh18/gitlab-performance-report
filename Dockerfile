FROM node:14-alpine
ADD package.json package.json
RUN npm install
ADD src .
ADD tsconfig.json tsconfig.json
RUN npm run tsc
ENTRYPOINT [ "node",  "newMain.js" ]
