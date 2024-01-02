FROM node:18 as builder

WORKDIR /myapp
COPY package.json .
RUN npm install

COPY . .
# COPY tsconfig.json .
RUN npm run build

# Etapa 2:

FROM node:18-alpine

WORKDIR /myapp

COPY --from=builder /myapp/build ./build
COPY --from=builder /myapp/node_modules ./node_modules
COPY --from=builder /myapp/package*.json ./

CMD ["npm", "start"]
