import axios from "axios";

const pullProjects = async() => {
    try {
        const resp = await axios.get("/api/projects")
        if (resp.status !== 200) {
            throw new Error("status code not 200: " + resp.status)
        }
        const compareProjects = (a, b) => {
            if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            }
            return 0
        }
        return resp.data.projects.sort(compareProjects);
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

const getProject = async({ id }) => {
    try {
        const resp = await axios.get("/api/project/" + id)
        return resp.data.project
    } catch (err) {
        console.error(err);
    }
    return undefined
}

const addProject = async({ name, description }) => {
    const resp = await axios.post("/api/project", { name, description });
    return resp.status
}

const updateProject = async({ name, description, id, completed }) => {
    const resp = await axios.put("/api/project" + "/" + id, { name, description, completed });
    return resp.status
}

const deleteProject = async({ id }) => {
    const resp = await axios.delete("/api/project" + "/" + id);
    return resp.status
}

const pullTasks = async(projectId) => {
    try {
        const resp = await axios.get("/api/project/" + projectId + "/tasks")
        if (resp.status !== 200) {
            throw new Error("status code not 200: " + resp.status)
        }
        const compareTasks = (a, b) => {
            if (a.detail < b.detail) {
                return -1
            } else if (a.detail > b.detail) {
                return 1
            }
            return 0
        }
        return resp.data.tasks.sort(compareTasks);
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

const addTask = async(projectId, { detail, start }) => {
    const resp = await axios.post("/api/project/" + projectId + "/task", { detail, start })
    return resp.status
}

const updateTask = async(projectId, taskId, { detail, start, milliseconds, finish }) => {
    const resp = await axios.put("/api/project/" + projectId + "/task/" + taskId, { detail, start, milliseconds, finish })
    return resp.status
}

export {
    pullProjects,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    pullTasks,
    addTask,
    updateTask
}