import express from 'express';
import HttpError from '../Errors/HttpError.js';
import httpMethods from './httpMethods.js';
import projectsRoutes from './projectsApi.js';
import usersRoutes from './usersAPI.js';
import tasksRoutes from './tasksApi.js';
import sessionsRoutes from './sessionsApi.js';

export default (db) => {
    const router = express.Router();
    const usersRoutesList = usersRoutes(db);
    const projectRoutesList = projectsRoutes(db);
    const taskRoutesList = tasksRoutes(db);
    const sessionRoutesList = sessionsRoutes(db);
    const routes = [...projectRoutesList, ...usersRoutesList, ...taskRoutesList, ...sessionRoutesList]

    const handlerWrapper = (handler, req, res) => {
        return async(req, res) => {
            try {
                return await handler(req, res)
            } catch (err) {
                console.error(err)
                if (err instanceof HttpError) {
                    return res.status(err.status).json(err.toJSON())
                }
                return res.status(500).json({ errror: "Internal Issues. Try again later" });
            }
        }
    }

    routes.forEach(route => {
        if (route.method === httpMethods.get) {
            router.get(route.url, handlerWrapper(route.handler))
        } else if (route.method === httpMethods.post) {
            router.post(route.url, handlerWrapper(route.handler))
        } else if (route.method === httpMethods.put) {
            router.put(route.url, handlerWrapper(route.handler))
        } else if (route.method === httpMethods.patch) {
            router.patch(route.url, handlerWrapper(route.handler))
        } else if (route.method === httpMethods.delete) {
            router.delete(route.url, handlerWrapper(route.handler))
        }
    })

    return router
}