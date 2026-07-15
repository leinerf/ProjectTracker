# Welcome to ProjectTracker
## What the project does and why is it useful?

Project tracker is a web app that allow users to record projects they want to work on and track the tasks that progress their productivity on the projects users want to work on. ProjectTracker allows users to be more cognisant of how much time and effort they spend on a project, by tracking the amount of time a user spends on a task to progress towards their goal/project.

### Design Document
[Design Document](https://docs.google.com/document/d/10uzNk-nrVGz-cYtjBqeL1ce4fbEqKSmyRVvK0LsYfNA/edit?usp=sharing)

## How users can get started with the project

### Setup env files in backend and frontend folders
**backend .env file**
```
APP_ENV=dev
BASE_URL=localhost
DATABASE=ProjectTracker
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=localhost
DB_PORT=5433
PORT=3000
JWT_EXPIRATION=48
JWT_SECRET=DEV_SECRET
JWT_ALGO=HS256
FRONTEND_BUILD=frontend/dist/index.html
```

**frontend .env file**
```
CLIENT_ID=<GOOGLE_AUTH_CLIENT_ID>
BASE_URL=http://localhost:5173
PROD_BASE_URL=http://localhost:3000
```

### Start App
To start the backend and frontend run: 

Backend
```javascript
nvm install 24.15.0
nvm use 24.15.0
npm install
npm run dev
```

Frontend
```javascript
nvm install 24.15.0
nvm use 24.15.0
npm install
npm run dev
```

### Run app in docker

Change DB_HOST value from localhost to host.docker.internal to access host database

**docker backend .env file**
```
APP_ENV=docker
PORT=3000
JWT_EXPIRATION=48
JWT_SECRET=DEV_SECRET
JWT_ALGO=HS256
DB_USER=postgres
DB_PASSWORD=password
DB_HOST=host.docker.internal
DB_PORT=5433
DATABASE=ProjectTracker
FRONTEND_BUILD=frontend/dist/index.html
```

**docker commands**
'''
docker build -f dev.dockerfile -t project-tracker:latest .
docker run -d -p 3000:3000 project-tracker:latest --add-host=host.docker.internal:host-gateway
'''

## How to contribute and how to reach me
If you need help or wish to maintain/contribute to this project, fork project, clone project and create a pull request, then add me as a reviewer [leinerf](https://github.com/leinerf). If you wish to reach out to me personally, my email is frenielzabala@gmail.com