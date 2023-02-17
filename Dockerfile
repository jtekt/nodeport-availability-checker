FROM node:18

WORKDIR /app
COPY ./ .

RUN npm install

EXPOSE 3000

# BUILDING AT RUNTIME IS DIRTY
CMD npm run build && node build/index.js