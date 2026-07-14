import axios from "axios";

const getProjects = async(sort = "due_date", status = "inProgress", offset = 0, limit = 10) => {
    const resp = await axios.get(`/api/projects?sort=${sort}&status=${status}&offset=${offset}&limit=${limit}`)
    if (resp.status !== 200) {
        throw new Error("status code not 200: " + resp.status)
    }
    return resp.data
}

const getProject = async({ id }, time = "false") => {
    try {
        const resp = await axios.get(("/api/projects/" + id) + (time === "true" ? "?time=" + time : ""))
        return resp.data.project
    } catch (err) {
        console.error(err);
    }
    return undefined
}

const addProject = async({ name, description, due_date, priority, status }) => {
    const resp = await axios.post("/api/projects", { name, description, due_date, priority: parseInt(priority), status });
    if (resp.status !== 201) {
        throw new Error("status code not 201: " + resp.status)
    }
    return resp.data
}

const updateProject = async({ name, description, id, status, due_date, priority }) => {
    const resp = await axios.put("/api/projects" + "/" + id, { name, description, status, due_date, priority: parseInt(priority) });
    if (resp.status !== 200) {
        throw new Error("status code not 200: " + resp.status)
    }
    return resp.data
}

const deleteProject = async({ id }) => {
    const resp = await axios.delete("/api/projects" + "/" + id);
    if (resp.status !== 204) {
        throw new Error("status code not 204: " + resp.status)
    }
    return resp.data
}

const getTasks = async(projectId, offset = 0, limit = 10, status = "inProgress") => {
    // gets tasks and sorts them by date
    try {
        const resp = await axios.get(`/api/projects/${projectId}/tasks?offset=${offset}&limit=${limit}&status=${status}`)
        if (resp.status !== 200) {
            throw new Error("status code not 200: " + resp.status)
        }
        return resp.data.tasks;
    } catch (err) {
        console.error(err);
        return [];
    }
}

const addTask = async(projectId, { name, detail }) => {
    const resp = await axios.post("/api/projects/" + projectId + "/tasks", { name, detail })
    return resp.data
}

const updateTask = async(projectId, taskId, { name, detail, milliseconds, complete }) => {
    const resp = await axios.put("/api/projects/" + projectId + "/tasks/" + taskId, { name, detail, milliseconds, complete })
    return resp.status
}

const deleteTask = async(projectId, taskId) => {
    const resp = await axios.delete("/api/projects/" + projectId + "/tasks/" + taskId);
    return resp.status
}

const getSessionTask = async(projectId) => {
    const resp = await axios.get("/api/projects/" + projectId + "/sessions")
    return resp.data
}

export {
    getProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getSessionTask
}