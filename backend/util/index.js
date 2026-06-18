import jwt from "jsonwebtoken";

const jwtExp = (hours) => {
    return 60 * 60 * hours
}
const createJWT = (payload) => {
    const expiresIn = jwtExp(process.env.JWT_EXPIRATION)
    const token = jwt.sign(
        payload,
        process.env.JWT_SECRET, {
            algorithm: process.env.JWT_ALGO,
            expiresIn: expiresIn
        },
    );
    return { token, expiresIn };
}

export { createJWT };