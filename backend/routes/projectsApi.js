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
            const project = await db.Project.findOne({ where: { id, user_id: userID } });

            if (project === null) {
                throw new ResourceNotFound("project", "GET")
            }

            const projectObj = project.dataValues
            const hyperLinks = createHyperLinks(project.id);

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
            await project.destroy();
            const hyperLinks = createHyperLinks()
            return res.status(204).json({ links: hyperLinks });
        }
    }, {
        method: httpMethods.get,
        url: `${baseUrl}/:id/time`,
        handler: async(req, res) => {
            const id = req.params.id
            if (!uuidValidate(id)) {
                throw new ResourceNotFound("project", "GET")
            }
            const { id: userID } = req.auth;
            const tasks = await db.Task.findAll({ where: { user_id: userID, project_id: id } })
            let total = 0,
                yearly = 0,
                monthly = 0,
                weekly = 0,
                daily = 0;
            tasks.forEach(task => {
                const taskDate = new Date(task.createdAt)
                const currDate = new Date()
                total += task.milliseconds
                if (taskDate.getUTCFullYear() === currDate.getUTCFullYear()) {
                    yearly += task.milliseconds
                    if (taskDate.getUTCMonth() === currDate.getUTCMonth()) {
                        monthly += task.milliseconds
                        const daysApart = Math.floor((currDate.getTime() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
                        const weekDayApart = currDate.getUTCDay() - taskDate.getUTCDay()
                        if (daysApart === weekDayApart) {
                            weekly += task.milliseconds
                            if (currDate.getUTCDate() === taskDate.getUTCDate()) {
                                daily += task.milliseconds
                            }
                        }
                    }
                }
            })

            const hyperLinks = createHyperLinks(id)

            return res.status(200).json({
                total,
                yearly,
                monthly,
                weekly,
                daily,
                links: hyperLinks
            })
        }
    }]
}

export { baseUrl }
export default projectsRoutes