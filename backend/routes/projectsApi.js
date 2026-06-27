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
            const { time } = req.query
            const projects = await db.Project.findAll({ where: { user_id: userID } });
            if (projects === null) {
                throw ResourceNotFound("projects", req.method);
            }
            const projectList = []
            for (let i = 0; i < projects.length; i++) {
                const project = projects[i].dataValues;
                if (time === "true") {
                    let milliseconds = 0;
                    const tasks = await db.Task.findAll({ where: { user_id: userID, project_id: project.id } })
                    tasks.forEach(task => {
                        milliseconds += task.milliseconds
                    })
                    project.milliseconds = milliseconds
                }
                projectList.push(project)
            }
            const hyperLinks = createHyperLinks()
            return res.status(200).json({
                projects: projectList,
                links: hyperLinks
            });
        }
    }, {
        method: httpMethods.post,
        url: baseUrl,
        handler: async(req, res) => {
            const { id: userID } = req.auth;
            const { name, description } = req.body;
            if (name === undefined || name.length === 0 || description === undefined || description.length === 0) {
                throw new ResourceBadRequest("projects", req.method)
            }
            const project = await db.Project.create({ name, description, user_id: userID });
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
            const { name, description, completed } = req.body;
            const project = await db.Project.findOne({ where: { id, user_id: userID } });
            if (project === null) {
                throw new ResourceNotFound("projects", req.method)
            }
            if (name !== undefined && typeof name !== "string" || description !== undefined && typeof description !== "string" || completed !== undefined && typeof completed !== "boolean") {
                throw new ResourceConflictError("projects", req.method);
            }
            project.set({
                name: name !== undefined ? name : project.name,
                description: description !== undefined ? description : project.description,
                completed: completed !== undefined ? completed : project.completed
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
    }]
}

export { baseUrl }
export default projectsRoutes