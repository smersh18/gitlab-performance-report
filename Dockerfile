FROM node:14-alpine
WORKDIR /opt
ADD package.json /opt/package.json
RUN npm install
ADD src /opt
ADD tsconfig.json /opt/tsconfig.json
RUN npm run tsc
ENTRYPOINT [ "node",  "newMain.js" ]
