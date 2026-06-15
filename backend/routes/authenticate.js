import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createJWT } from '../util/index.js';

export default (db) => {
    const router = express.Router();
    router.get("/google-signin", async(req, res) => {
        const token = req.query["access_token"]
        try {
            const resp = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token);
            if (resp.data.verified_email) {
                const user = await db.User.findOne({ where: { email: resp.data.email } })
                if (user) {
                    const { username, email, id } = user.toJSON();
                    const { token: userToken, expiresIn } = createJWT({ id });
                    const currDate = new Date();
                    const jwtExp = currDate.setSeconds(currDate.getSeconds() + expiresIn);
                    return res.status(200).cookie('auth_jwt', userToken, {
                        httpOnly: true,
                        secure: true,
                        maxAge: expiresIn * 1000 //cookie in miliseconds expiresIn is in seconds
                    }).json({ jwt_exp: jwtExp, username, email });
                }
            }
        } catch (err) {
            console.error(err)
        }

        return res.status(500).json({ msg: "could not verify email" });
    })

    router.get("/google-signup", async(req, res) => {
        const token = req.query["access_token"]
        try {
            const resp = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token);
            if (resp.data.verified_email) {
                const existingUser = await db.User.findOne({ where: { email: resp.data.email } })
                if (existingUser) {
                    throw new Error("this user already exists")
                }
                const { email, verified_email } = resp.data;
                const username = email.substring(0, email.indexOf("@"));
                const user = await db.User.create({
                    username,
                    email,
                    password: "google-auth"
                })
                const { id } = user.toJSON();
                const { token: userToken, expiresIn } = createJWT({ id });
                const currDate = new Date()
                const jwtExp = currDate.setSeconds(currDate.getSeconds() + expiresIn);
                return res.status(200).cookie('auth_jwt', userToken, {
                    httpOnly: true,
                    secure: true,
                    maxAge: expiresIn * 1000 //cookie in miliseconds expiresIn is in seconds
                }).json({ jwt_exp: jwtExp, username, email });
            }
        } catch (err) {
            console.error(err);
        }

        return res.status(500).json({ msg: "could not verify email" });
    })

    router.get("/logout", (req, res) => {
        return res.status(200).clearCookie("auth_jwt").json({ msg: "logout successful" });
    })

    router.get("/pingCookie", (req, res) => {
        console.log(req.cookies.auth_jwt)
        return res.json({ msg: "server pinged" })
    })
    return router;
}