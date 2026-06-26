import { config } from "dotenv"

//load env
config()

const appConfig = {
    appEnv: process.env.APP_ENV,
    baseURL: process.env.BASE_URL,
    port: process.env.PORT,
    jwtExpiration: process.env.JWT_EXPIRATION,
    jwtSecret: process.env.JWT_SECRET,
    jwtAlgo: process.env.JWT_ALGO,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    dbHost: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    database: process.env.DATABASE,
    frontendBuild: process.env.FRONTEND_BUILD
}
export default appConfig