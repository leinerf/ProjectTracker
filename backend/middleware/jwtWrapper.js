import { expressjwt } from "express-jwt"
import appConfig from "../config.js";


function jwtWrapper() {
    return expressjwt({
        secret: appConfig.jwtSecret,
        algorithms: [appConfig.jwtAlgo],
        getToken: req => req.cookies.auth_jwt,
    })
}

export default jwtWrapper;