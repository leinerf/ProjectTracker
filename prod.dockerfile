# syntax = docker/dockerfile:1.2
FROM node:lts-alpine3.24
WORKDIR /app
COPY . .
RUN --mount=type=file,id=_env,dst=/etc/secrets/.env cp etc/secrets/.env frontend/.env | ./build.sh
WORKDIR /app/backend
EXPOSE 3000
ENTRYPOINT ["node", "--env-file=.env-prod" ,"app.js"]