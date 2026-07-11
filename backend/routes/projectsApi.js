import express from 'express';
import { createHyperLinks } from '../util/index.js';
import ResourceNotFound from '../Errors/ResourceNotFound.js';
import ResourceConflictError from '../Errors/ResourceConflicError.js';
import ResourceBadRequest from '../Errors/ResourceBadRequest.js';
import httpMethods from './httpMethods.js';
import { validate as uuidValidate } from 'uuid';

const baseUrl = "/projects";
const projectsRoutes = db => {
    return [{
        method: httpMethods.get,
        url: baseUrl,
        handler: async(req, res) => {
            const { id: userID } = req.auth;
            const { sort, offset, limit, status } = req.query;
            const sortingTypes = ["name", "priority", "due_date", "createdAt"]
            const sortingOptions = {
                "name": ["name", "ASC"],
                "priority": ["priority", "ASC"],
                "due_date": ["due_date", "ASC"],
                "createdAt": ["createdAt", "DESC"]
            }

            if (sort !== undefined && !sortingTypes.includes(sort)) {
                throw new ResourceBadRequest("projects", req.method)
            }
            if (offset !== undefined && (isNaN(parseInt(offset)) || parseInt(offset) < 0)) {
                throw new ResourceBadRequest("projects", req.method)
            }
            if (limit !== undefined && (isNaN(parseInt(limit)) || parseInt(limit) < 0)) {
                throw new ResourceBadRequest("projects", req.method)
            }
            if (status !== undefined && !["inProgress", "completed"].includes(status)) {
                throw new ResourceBadRequest("projects", req.method)
            }

            const projects = await db.Project.findAll({
                where: { user_id: userID, status: status !== undefined ? status : "inProgress" },
                order: sort !== undefined ? [sortingOptions[sort]] : [sortingOptions.due_date],
                offset: offset !== undefined ? parseInt(offset) : 0,
                limit: limit !== undefined ? parseInt(limit) : 10
            });
            if (projects === null) {
                throw ResourceNotFound("projects", req.method);
            }
            const projectList = []
            for (let i = 0; i < projects.length; i++) {
                const project = projects[i].dataValues;
                projectList.push(project)
            }
            const hyperLinks = createHyperLinks()
            return res.status(200).json({
                projects: projectList,
                links: hyperLinks,
                order: sort !== undefined ? sortingOptions[sort] : sortingOptions.due_date,
                offset: offset !== undefined ? parseInt(offset) : 0,
                limit: limit !== undefined ? parseInt(limit) : 10
            });
        }
    }, {
        method: httpMethods.post,
        url: baseUrl,
        handler: async(req, res) => {
            const { id: userID } = req.auth;
            const { name, description, priority, due_date, status } = req.body;
            const dueDate = new Date(due_date)
            if (name === undefined || name.length === 0 ||
                description === undefined || description.length === 0 ||
                priority === undefined || priority < 1 || priority > 9 ||
                due_date === undefined || isNaN(dueDate) ||
                status === undefined || (status !== "inProgress" && status !== "completed")
            ) {
                throw new ResourceBadRequest("projects", req.method)
            }
            const project = await db.Project.create({ name, description, user_id: userID, priority, due_date: dueDate, status });
            const hyperLinks = createHyperLinks(project.id)
            return res.status(201).json({
                project: project.toJSON(),
                links: hyperLinks
            });
        }
    }, {
        method: httpMethods.get,
        url: `${baseUrl}/:id`,
        handler: async(req, res) => {
            const id = req.params.id
            if (!uuidValidate(id)) {
                throw new ResourceNotFound("project", "GET")
            }

            const { id: userID } = req.auth;
            const { time } = req.query;
            const project = await db.Project.findOne({ where: { id, user_id: userID } });

            if (project === null) {
                throw new ResourceNotFound("project", "GET")
            }

            const projectObj = project.dataValues
            const hyperLinks = createHyperLinks(project.id);

            if (time !== undefined) {
                const tasks = await db.Task.findAll({ where: { user_id: userID, project_id: project.id } })
                let milliseconds = 0;
                tasks.forEach(task => milliseconds += task.milliseconds)
                projectObj.milliseconds = milliseconds
            }
            return res.status(200).json({
                project: projectObj,
                links: hyperLinks
            });
        }
    }, {
        method: httpMethods.put,
        url: `${baseUrl}/:id`,
        handler: async(req, res) => {
            const id = req.params.id
            const { id: userID } = req.auth;
            const { name, description, completed, priority, due_date, status } = req.body;
            const dueDate = new Date(due_date)
            const project = await db.Project.findOne({ where: { id, user_id: userID } });
            if (project === null) {
                throw new ResourceNotFound("projects", req.method)
            }
            if (name !== undefined && typeof name !== "string" ||
                description !== undefined && typeof description !== "string" ||
                priority !== undefined && typeof priority !== "number" ||
                due_date !== undefined && isNaN(dueDate) ||
                status !== undefined && typeof status !== "string") {
                throw new ResourceConflictError("projects", req.method);
            }
            project.set({
                name: name !== undefined ? name : project.name,
                description: description !== undefined ? description : project.description,
                priority: priority !== undefined ? priority : project.priority,
                due_date: due_date !== undefined ? dueDate : project.due_date,
                status: status !== undefined ? status : project.status
            })
            await project.save();
            const hyperLinks = createHyperLinks(project.id)
            return res.status(200).json({
                project: project.toJSON(),
                links: hyperLinks
            });
        }
    }, {
        method: httpMethods.delete,
        url: `${baseUrl}/:id`,
        handler: async(req, res) => {
            const id = req.params.id
            const { id: userID } = req.auth;
            const project = await db.Project.findOne({ where: { id, user_id: userID } });
            if (project === null) {
                throw new ResourceNotFound("projects", req.method);
            }
            const tasks = await db.Task.findAll({ where: { project_id: project.id, user_id: userID } })
            if (tasks !== null) {
                for (let i = 0; i < tasks.length; i++) {
                    await tasks[i].destroy()
                }
            }
            await project.destroy();
            const hyperLinks = createHyperLinks()
            return res.status(204).json({ links: hyperLinks });
        }
    }, {
        method: httpMethods.post,
        url: `${baseUrl}/:id/sessions`,
        handler: async(req, res) => {
            // creates a task and update project session to task
            const { name, detail } = req.body;
            const { id: project_id } = req.params;
            const { id: user_id } = req.auth;

            if (name === undefined || name.length === 0 || detail === undefined || detail.length === 0) {
                throw new ResourceBadRequest("projects", req.method)
            }

            const session = await db.Session.findOne({ where: { user_id, project_id } });
            if (session === null) {
                throw new ResourceNotFound("project/session", httpMethods.post)
            }

            const task = await db.Task.create({
                name,
                detail,
                project_id,
                user_id
            })

            session.task_id = task.id;
            session.save()

            const hyperLinks = createHyperLinks(project_id)

            return res.status(201).json({
                task: task.toJSON(),
                links: [
                    ...hyperLinks,
                    {
                        rel: "sessions",
                        href: baseURL + "/api/projects/" + projectID + "/sessions",
                        auth: "required",
                        action: httpMethods.post,
                        types: ["application/json"]
                    },
                    {
                        rel: "sessions",
                        href: baseURL + "/api/projects/" + projectID + "/sessions",
                        auth: "required",
                        action: httpMethods.get,
                        types: ["application/json"]
                    }
                ]
            })
        }
    }, {
        method: httpMethods.get,
        url: `${baseUrl}/:id/sessions`,
        handler: async(req, res) => {
            // find session task
            const { id: project_id } = req.params;
            const { id: user_id } = req.auth;

            const session = await db.Session.findOne({ where: { user_id, project_id } });
            if (session === null) {
                throw new ResourceNotFound("project/session", httpMethods.post)
            }

            const task = await db.Task.findOne({ where: { id: session.task_id } })
            const hyperLinks = createHyperLinks(project_id)

            return res.status(200).json({
                task: task !== null ? task.toJSON() : null,
                links: [
                    ...hyperLinks,
                    {
                        rel: "sessions",
                        href: baseURL + "/api/projects/" + projectID + "/sessions",
                        auth: "required",
                        action: httpMethods.post,
                        types: ["application/json"]
                    },
                    {
                        rel: "sessions",
                        href: baseURL + "/api/projects/" + projectID + "/sessions",
                        auth: "required",
                        action: httpMethods.get,
                        types: ["application/json"]
                    }
                ]
            })
        }
    }]
}

export { baseUrl }
export default projectsRoutes