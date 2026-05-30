import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createJWT } from '../util.js';

export default (db) => {
    const router = express.Router();
    router.post("/google-signin", async(req, res) => {
        const token = req.query["access_token"]
        const resp = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token);
        if (resp.data.verified_email) {
            const user = await db.User.findOne({ where: { email: resp.data.email } })
            if (user) {
                const { username, email, id } = user.toJSON();
                const userToken = createJWT({ username, email, id });
                return res.json({ verified_email: true, username, email, token: userToken });
            }
        }
        return res.json({ verified_email: false });
    })

    router.post("/google-signup", async(req, res) => {
        const token = req.query["access_token"]
        const resp = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + token);
        if (resp.data.verified_email) {
            const { email, verified_email } = resp.data;
            const username = email.substring(0, email.indexOf("@"));
            const user = await db.User.create({
                username,
                email,
                password: "google-auth"
            })
            const userToken = createJWT({ username, email, id })
            return res.json({ verified_email: true, username, email, token: userToken });
        }

        return res.json({ verified_email: false });
    })

    return router;
}