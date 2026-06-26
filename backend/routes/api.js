import express from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { createJWT } from '../util/index.js';
import appConfig from '../config.js';
import ResourceNotFound from '../Errors/ResourceNotFound.js';
import ResourceConflictError from '../Errors/ResourceConflicError.js';

/* 
{
  "orderID":3,
  "productID":2,
  "quantity":4,
  "orderValue":16.60,
  "links":[
    {
      "rel":"customer",
      "href":"https://api.contoso.com/customers/3",
      "action":"GET",
      "types":["text/xml","application/json"]
    },
    {
      "rel":"customer",
      "href":"https://api.contoso.com/customers/3",
      "action":"PUT",
      "types":["application/x-www-form-urlencoded"]
    },
    {
      "rel":"customer",
      "href":"https://api.contoso.com/customers/3",
      "action":"DELETE",
      "types":[]
    },
    {
      "rel":"self",
      "href":"https://api.contoso.com/orders/3",
      "action":"GET",
      "types":["text/xml","application/json"]
    },
    {
      "rel":"self",
      "href":"https://api.contoso.com/orders/3",
      "action":"PUT",
      "types":["application/x-www-form-urlencoded"]
    },
    {
      "rel":"self",
      "href":"https://api.contoso.com/orders/3",
      "action":"DELETE",
      "types":[]
    }]
}
*/

export default (db) => {
    const router = express.Router();
    const baseURL = appConfig.baseURL + appConfig.appEnv === 'prod' ? "" : ":" + appConfig.port
    router.put("/users", async(req, res) => {
        try {
            const { id } = req.auth;
            const { username: newUsername } = req.body;
            if (newUsername === undefined) {
                throw new ResourceConflictError("users")
            }
            const user = await db.User.findOne({ where: { id } })
            if (user === null) {
                throw new ResourceNotFound("users")
            }
            user.set({ username: newUsername || user.username })
            await user.save();
            return res.status(200).json({
                msg: "username changed to " + newUsername,
                username: newUsername,
                links: [{
                    rel: "users",
                    href: baseURL + "/api/users",
                    auth: "required",
                    action: "PUT",
                    types: ["application/json"]
                }]
            })
        } catch (err) {
            console.error(err);
            if (error instanceof ResourceNotFound) {
                return res.status(error.status).json({ error: error.msg, resource: error.resource })
            }
        }
        return res.status(500).json({ errror: "Internal Issues. Try again later" });
    })

    router.get("/projects", async(req, res) => {
        try {
            const { id: userID } = req.auth;
            const projects = await db.Project.findAll({ where: { user_id: userID } });
            if (projects === null) {
                throw ResourceNotFound("projects");
            }
            const projectList = projects.map(project => {
                const { name, description, id, completed } = project.dataValues
                return { name, description, id, completed }
            });
            return res.status(200).json({
                projects: projectList,
                links: [{
                        "rel": "self",
                        "href": "https://api.contoso.com/orders/3",
                        "action": "GET",
                        "types": ["text/xml", "application/json"]
                    },
                    {
                        rel: "projects",
                        href: `${appConfig.baseURL}/api/projects`
                        action: "GET",
                        types: ["application/json"]
                    }
                ]
            });
        } catch (err) {
            console.error(err)
            if (err instanceof ResourceNotFound) {
                return res.status(err.status).json({ error: err.message, resource: err.resource })
            }

        }
        return res.status(500).json({ errror: "Internal Issues. Try again later" });
    })

    router.post("/projects", async(req, res) => {
        try {
            const { id: userID } = req.auth;
            const { name, description } = req.body;
            if (name === undefined || name.length === 0 || description === undefined || description.length === 0) {
                throw new Error("missing or invalid inputs")
            }
            const project = await db.Project.create({ name, description, user_id: userID });
            return res.status(200).json({ msg: "project added" });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.get("/projects/time", async(req, res) => {
        try {
            const { id: userID } = req.auth;
            const tasks = await db.Task.findAll({ where: { user_id: userID } })
            let result = 0;
            tasks.forEach(task => result += task.milliseconds);
            return res.status(200).json({ time: result })
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err });
        }
    })

    router.get("/projects/:id", async(req, res) => {
        const id = req.params.id
        const { id: userID } = req.auth;
        try {
            const project = await db.Project.findOne({ where: { id, user_id: userID } });
            return res.status(200).json({ msg: "project read", project: project.toJSON() });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.put("/projects/:id", async(req, res) => {
        const id = req.params.id
        const { id: userID } = req.auth;
        try {
            const { name, description, completed } = req.body;
            const project = await db.Project.findOne({ where: { id, user_id: userID } });
            project.set({
                name: name !== undefined ? name : project.name,
                description: description !== undefined ? description : project.description,
                completed: completed !== undefined ? completed : project.completed
            })
            await project.save();
            return res.status(200).json({ msg: "project updated", project: project.toJSON() });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.delete("/projects/:id", async(req, res) => {
        const id = req.params.id
        const { id: userID } = req.auth;
        try {
            const project = await db.Project.findOne({ where: { id, user_id: userID } });
            const tasks = await db.Task.findAll({ where: { project_id: project.id, user_id: userID } })
            tasks.forEach(async task => { await task.destroy() });
            await project.destroy();
            return res.status(200).json({ msg: "project deleted" });
        } catch (err) {
            console.error(err)
            return res.status(500).json({ err })
        }
    })

    router.get("/projects/:id/time", async(req, res) => {
        const id = req.params.id
        const { id: userID } = req.auth;
        try {
            const tasks = await db.Task.findAll({ where: { project_id: id, user_id: userID } })
            let totalTime = 0;
            tasks.forEach(task => totalTime += task.milliseconds)
            return res.status(200).json({ msg: "total time", milliseconds: totalTime })
        } catch (err) {
            console.error(err);
            return res.status(500).json({ err })
        }
    })

    router.get("/projects/:projectId/tasks", async(req, res) => {
        try {
            const { projectId: project_id } = req.params;
            const { id: user_id } = req.auth;
            const tasks = await db.Task.findAll({ where: { project_id, user_id } });
            const taskList = tasks.map(task => {
                const { detail, id, done, start, milliseconds, finish } = task.dataValues
                return { detail, id, done, start, milliseconds, finish }
            });
            return res.status(200).json({ tasks: taskList });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ err });
        }
    })

    router.post("/projects/:projectId/tasks", async(req, res) => {
        try {
            const { detail, start } = req.body;
            const { projectId: project_id } = req.params;
            const { id: user_id } = req.auth;
            const task = await db.Task.create({
                detail,
                start,
                project_id,
                user_id
            })
            return res.status(200).json({
                msg: "successfully created",
                task: task.toJSON()
            })
        } catch (err) {
            console.error(err);
        }
        return res.status(500).json({ msg: "could not create task because of internal issues" })
    })

    router.put("/projects/:projectId/tasks/:taskId", async(req, res) => {
        try {
            const { detail, start, finish, milliseconds } = req.body;
            const { projectId: project_id, taskId: id } = req.params;
            const { id: user_id } = req.auth;
            const task = await db.Task.findOne({ where: { project_id, user_id, id } })
            task.set({
                detail: detail !== undefined ? detail : task.detail,
                start: start !== undefined ? start : task.start,
                finish: finish !== undefined ? finish : task.finish,
                milliseconds: milliseconds !== undefined ? milliseconds : task.milliseconds
            })
            await task.save();
            return res.status(200).json({
                msg: "successfully updated",
                task: task.toJSON()
            })
        } catch (err) {
            console.error(err);
        }
        return res.status(500).json({ msg: "could not update task because of internal issues" })
    })

    router.delete("/projects/:projectId/tasks/:taskId", async(req, res) => {
        try {
            const { projectId: project_id, taskId: id } = req.params;
            const { id: user_id } = req.auth;
            const task = await db.Task.findOne({ where: { project_id, user_id, id } })
            await task.destroy();
            return res.status(200).json({
                msg: "successfully deleted",
            })
        } catch (err) {
            console.error(err);
        }
        return res.status(500).json({ msg: "could not delete task because of internal issues" })
    })

    return router;
}