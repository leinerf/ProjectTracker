import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createJWT } from '../util.js';

export default (db) => {
    const router = express.Router();

    router.put("/user", async(req, res) => {
        try {
            const { id } = req.auth;
            const { username: newUsername } = req.body;
            const user = await db.User.findOne({ where: { id } })
            user.set({ username: newUsername || user.username })
            await user.save();
            return res.status(200).json({
                msg: "username changed to " + newUsername,
                username: newUsername
            })
        } catch (err) {
            console.error(err);
        }
        return res.status(500).json({ msg: "something went wrong" });
    })

    router.get("/tasks", async(req, res) => {
        try {
            const { id: userID } = req.auth;
            const tasks = await db.Task.findAll({ where: { user_id: userID } });
            const taskList = tasks.map(task => {
                const { name, description, id, completed } = task.dataValues
                return { name, description, id, completed }
            });
            return res.status(200).json({ tasks: taskList });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.post("/task", async(req, res) => {
        try {
            const { id: userID } = req.auth;
            const { name, description } = req.body;
            const task = await db.Task.create({ name, description, user_id: userID });
            return res.status(200).json({ msg: "task added" });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.get("/task/:id", async(req, res) => {
        const id = req.params.id
        const { id: userID } = req.auth;
        try {
            const task = await db.Task.findOne({ where: { id, user_id: userID } });
            return res.status(200).json({ msg: "task read", task: task.toJSON() });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.put("/task/:id", async(req, res) => {
        const id = req.params.id
        const { id: userID } = req.auth;
        try {
            const { name, description, completed } = req.body;
            const task = await db.Task.findOne({ where: { id, user_id: userID } });
            task.set({
                name: name !== undefined ? name : task.name,
                description: description !== undefined ? description : task.description,
                completed: completed !== undefined ? completed : task.completed
            })
            await task.save();
            return res.status(200).json({ msg: "task updated", task: task.toJSON() });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.delete("/task/:id", async(req, res) => {
        const id = req.params.id
        const { id: userID } = req.auth;
        try {
            const task = await db.Task.findOne({ where: { id, user_id: userID } });
            await task.destroy();
            return res.status(200).json({ msg: "task deleted" });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })
    return router;
}