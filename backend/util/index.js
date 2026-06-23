import jwt from "jsonwebtoken";
import appConfig from "../config.js";

const jwtExp = (hours) => {
    return 60 * 60 * hours
}
const createJWT = (payload) => {
    const expiresIn = jwtExp(appConfig.jwtExpiration)
    const token = jwt.sign(
        payload,
        appConfig.jwtSecret, {
            algorithm: appConfig.jwtAlgo,
            expiresIn: expiresIn
        },
    );
    return { token, expiresIn };
}

export { createJWT };