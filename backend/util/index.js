import jwt from "jsonwebtoken";
import appConfig from "../config.js";

const jwtExp = (hours) => {
    return 60 * 60 * hours
}
const createJWT = (payload) => {
    const expiresIn = jwtExp(appConfig.jwtExpiration)
    const token = jwt.sign(
        payload,
        appConfig.jwtSecret, {
            algorithm: appConfig.jwtAlgo,
            expiresIn: expiresIn
        },
    );
    return { token, expiresIn };
}

const createHyperLinks = (projectID = null, taskID = null) => {
    const baseURL = appConfig.baseURL + (appConfig.appEnv === 'prod' ? "" : ":" + appConfig.port)
    const resourcesMethods = ["GET", "POST"]
    const resourceMethods = ["GET", "PUT", "DELETE"]
    const results = [{
            rel: "projects",
            href: baseURL + "/api/projects",
            auth: "required",
            action: "GET",
            types: ["application/json"]
        },
        {
            rel: "projects",
            href: baseURL + "/api/projects",
            auth: "required",
            action: "POST",
            types: ["application/json"]
        }
    ]
    if (projectID !== null) {
        resourcesMethods.forEach(method => {
            results.push({
                rel: "tasks",
                href: baseURL + "/api/projects/" + projectID + "/tasks",
                auth: "required",
                action: method,
                types: ["application/json"]
            })
        })
        resourceMethods.forEach(method => {
            results.push({
                rel: "projects",
                href: baseURL + "/api/projects/" + projectID,
                auth: "required",
                action: method,
                types: ["application/json"]
            })
        })
    }
    if (taskID !== null) {
        resourceMethods.forEach(method => {
            results.push({
                rel: "tasks",
                href: baseURL + "/api/projects/" + projectID + "/tasks/" + taskID,
                auth: "required",
                action: method,
                types: ["application/json"]
            })
        })
    }
    return results
}

export { createJWT, createHyperLinks };