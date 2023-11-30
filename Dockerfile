FROM node:18

WORKDIR /myapp
COPY package.json .
RUN npm install

COPY . .
# COPY tsconfig.json .
RUN npm run build
CMD npm start
