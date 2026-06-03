import jwt from "jsonwebtoken";

// TODO: add expiration
const createJWT = (payload) => {
    const userToken = jwt.sign(
        payload,
        process.env.JWT_SECRET, { algorithm: process.env.JWT_ALGO }
    );
    return userToken;
}

export { createJWT };