import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createJWT } from '../util.js';

export default (db) => {
    const router = express.Router();

    router.get("/ping", (req, res) => {
        //Shows decoded token
        console.log(req.auth);
        return res.json({ msg: "cookie successful" })
    })

    router.patch("/name", async(req, res) => {
        try {
            const { id } = req.auth;
            const { newUsername, oldUsername } = req.body;
            console.log(newUsername, oldUsername)
            const user = await db.User.findOne({ where: { id } })
            user.set({ username: newUsername })
            await user.save();
            return res.status(200).json({
                msg: "username changed from " + oldUsername + " to " + newUsername,
                username: newUsername
            })
        } catch (err) {
            console.error(err);
        }
        return res.status(500).json({ msg: "something went wrong" });
    })

    router.get("/task", async(req, res) => {
        try {
            const { id: userID } = req.auth;
            const tasks = await db.Task.findAll({ where: { user_id: userID } });
            console.log(tasks); //update this once we have tasks to add
            return res.status(200).json({ tasks: ["example1", "example2", "example3", "example4"] });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.post("/task", async(req, res) => {
        try {
            const { id: userID } = req.auth;
            const {} = req.body;
            return res.status(200).json({ msg: "task added" });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })
    return router;
}