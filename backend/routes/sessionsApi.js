import express from 'express';
import ResourceNotFound from '../Errors/ResourceNotFound.js';
import ResourceConflictError from '../Errors/ResourceConflicError.js';
import ResourceBadRequest from '../Errors/ResourceBadRequest.js';
import httpMethods from './httpMethods.js';
import { baseUrl as ProjectBaseUrl } from './projectsApi.js';
import appConfig from '../config.js';

const baseUrl = ProjectBaseUrl + "/:projectId/sessions"
const sessionsRoutes = (db) => {
    const baseURL = appConfig.baseURL + (appConfig.appEnv === 'prod' ? "" : ":" + appConfig.port)
    return [{
        method: httpMethods.get,
        url: baseUrl,
        handler: async(req, res) => {
            const { projectId: project_id } = req.params;
            const { id: user_id } = req.auth;
            const session = await db.Session.findOne({ where: { project_id, user_id } });
            if (session === null) {
                throw new ResourceNotFound("tasks", req.method)
            }
            const task = await db.Task.findOne({ where: { project_id, user_id, id: session.task_id } })
            return res.status(200).json({
                task: task !== null ? task.toJSON() : null,
                links: [{
                    rel: "sessions",
                    href: baseURL + "/" + baseUrl,
                    auth: "required",
                    action: "GET",
                    types: ["application/json"]
                }]
            });
        }
    }]
}

export { baseUrl }
export default sessionsRoutes;