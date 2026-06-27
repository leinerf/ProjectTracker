import express from 'express';
import { createHyperLinks } from '../util/index.js';
import ResourceNotFound from '../Errors/ResourceNotFound.js';
import ResourceConflictError from '../Errors/ResourceConflicError.js';
import ResourceBadRequest from '../Errors/ResourceBadRequest.js';
import httpMethods from './httpMethods.js';
import { baseUrl as ProjectBaseUrl } from './projectsApi.js';

const baseUrl = ProjectBaseUrl + "/:projectId/tasks"
const tasksRoutes = (db) => {
    return [{
            method: httpMethods.get,
            url: baseUrl,
            handler: async(req, res) => {
                const { projectId: project_id } = req.params;
                const { id: user_id } = req.auth;
                const tasks = await db.Task.findAll({ where: { project_id, user_id } });
                if (tasks === null) {
                    throw new ResourceNotFound("tasks", req.method)
                }
                const taskList = tasks.map(task => {
                    const { detail, id, done, start, milliseconds, finish } = task.dataValues
                    return { detail, id, done, start, milliseconds, finish }
                });
                const hyperLinks = createHyperLinks(project_id)
                return res.status(200).json({
                    tasks: taskList,
                    links: hyperLinks
                });
            }
        }, {
            method: httpMethods.post,
            url: baseUrl,
            handler: async(req, res) => {
                const { detail, start } = req.body;
                const { projectId: project_id } = req.params;
                const { id: user_id } = req.auth;

                if (detail === undefined || detail.length === 0 || isNaN(new Date(start))) {
                    throw new ResourceBadRequest("projects", req.method)
                }
                const task = await db.Task.create({
                    detail,
                    start,
                    project_id,
                    user_id
                })

                const hyperLinks = createHyperLinks(project_id)
                return res.status(201).json({
                    task: task.toJSON(),
                    links: hyperLinks
                })
            }
        },
        {
            method: httpMethods.get,
            url: baseUrl + "/:taskId",
            handler: async(req, res) => {
                const { projectId: project_id, taskId: id } = req.params;
                const { id: user_id } = req.auth;
                const task = await db.Task.findOne({ where: { project_id, user_id, id } })
                if (task === null) {
                    throw new ResourceNotFound("tasks", httpMethods.get)
                }
                const hyperLinks = createHyperLinks(project_id, id);
                return res.status(200).json({
                    task: task.toJSON(),
                    link: hyperLinks
                })
            }
        },
        {
            method: httpMethods.put,
            url: baseUrl + "/:taskId",
            handler: async(req, res) => {
                const { detail, start, finish, milliseconds } = req.body;
                const { projectId: project_id, taskId: id } = req.params;
                const { id: user_id } = req.auth;

                if (detail !== undefined && typeof detail !== "string" ||
                    start !== undefined && isNaN(new Date(start)) ||
                    finish !== undefined && isNaN(new Date(finish)) ||
                    milliseconds !== undefined && isNaN(Number(milliseconds))
                ) {
                    throw new ResourceConflictError("projects", req.method);
                }

                const task = await db.Task.findOne({ where: { project_id, user_id, id } })
                if (task === null) {
                    throw new ResourceNotFound("task", httpMethods.put)
                }
                task.set({
                    detail: detail !== undefined ? detail : task.detail,
                    start: start !== undefined ? start : task.start,
                    finish: finish !== undefined ? finish : task.finish,
                    milliseconds: milliseconds !== undefined ? milliseconds : task.milliseconds
                })
                await task.save();
                const hyperLinks = createHyperLinks(project_id, id);
                return res.status(200).json({
                    task: task.toJSON(),
                    links: hyperLinks
                })
            }
        }, {
            method: httpMethods.delete,
            url: baseUrl + "/:taskId",
            handler: async(req, res) => {
                const { projectId: project_id, taskId: id } = req.params;
                const { id: user_id } = req.auth;
                const task = await db.Task.findOne({ where: { project_id, user_id, id } })
                if (task === null) {
                    throw new ResourceNotFound("task", httpMethods.put)
                }
                await task.destroy();
                const hyperLinks = createHyperLinks(project_id)
                return res.status(204).json({
                    links: hyperLinks,
                })
            }
        }
    ]
}

export { baseUrl }
export default tasksRoutes;