import express from 'express';
import { createHyperLinks } from '../util/index.js';
import ResourceNotFound from '../Errors/ResourceNotFound.js';
import ResourceConflictError from '../Errors/ResourceConflicError.js';
import ResourceBadRequest from '../Errors/ResourceBadRequest.js';
import httpMethods from './httpMethods.js';

const baseUrl = "/users"
const usersRoutes = db => {
    return [{
        url: baseUrl,
        method: httpMethods.put,
        handler: async(req, res) => {
            const { id } = req.auth;
            const { username: newUsername } = req.body;
            if (newUsername === undefined) {
                throw new ResourceConflictError("users", req.method)
            }
            const user = await db.User.findOne({ where: { id } })
            if (user === null) {
                throw new ResourceNotFound("users", req.method)
            }
            if (newUsername === undefined || newUsername === "") {
                throw new ResourceConflictError("users", req.method)
            }
            user.set({ username: newUsername || user.username })
            await user.save();
            const hyperLinks = createHyperLinks()
            return res.status(200).json({
                msg: "username changed to " + newUsername,
                username: newUsername,
                links: [{
                    rel: "users",
                    href: baseURL + "/api/users",
                    auth: "required",
                    action: "PUT",
                    types: ["application/json"]
                }, ...hyperLinks]
            })
        }
    }]
}

export { baseUrl }
export default usersRoutes;