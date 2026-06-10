import { expressjwt } from "express-jwt"

function jwtWrapper() {
    return expressjwt({
        secret: process.env.JWT_SECRET,
        algorithms: [process.env.JWT_ALGO],
        getToken: req => req.cookies.auth_jwt,
    })
}

export default jwtWrapper;