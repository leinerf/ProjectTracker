# Welcome to Authenticate

Authenticate is a template project that handles the hard task of creating database, and writing authentication code. This project uses jwt to authenticate users and saves it into the browser's cookies. We skipped the hashing step/handling of passwords and instead use Google Auth to authenticate users(Hey better Google than me). All this project needs is google oauth api(for verifying users), and a postgress database uri string(for saving users). 

## Setup Env file
```

backend(save .env in backend folder)
PORT=3000
JWT_EXPIRATION=3 //how long should the jwt token last
JWT_SECRET=example_secret //secret used for creating jwt
JWT_ALGO=hashing_algo //algorithm used for creating jwt https://www.npmjs.com/package/jsonwebtoken
DB_USER=postgres //I used postgres but can change database easily in sequalize: https://sequelize.org/docs/v6/getting-started/
DB_PASSWORD=example_password
DB_HOST=localhost
DB_PORT=5433
DATABASE=YOUR_DATABASE

frontend(save .env in frontend folder)
CLIENT_ID=example_client_id //This should be taken from the google console api google console > clients tab
```

## Start App
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