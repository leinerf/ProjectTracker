FROM node:lts-alpine3.24
WORKDIR /app
COPY . .
RUN ./build.sh
WORKDIR /app/backend
EXPOSE 3000
ENTRYPOINT ["node", "--env-file=.env-prod" ,"app.js"]