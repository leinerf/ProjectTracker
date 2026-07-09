import axios from "axios";

const getProjects = async() => {
    try {
        const resp = await axios.get("/api/projects")
        if (resp.status !== 200) {
            throw new Error("status code not 200: " + resp.status)
        }
        return resp.data.projects
    } catch (err) {
        console.error(err);
        return undefined;
    }
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
    return resp.status
}

const getTasks = async(projectId) => {
    // gets tasks and sorts them by date
    try {
        const resp = await axios.get("/api/projects/" + projectId + "/tasks")
        if (resp.status !== 200) {
            throw new Error("status code not 200: " + resp.status)
        }

        const compareTasksDate = (a, b) => {
            const aStart = new Date(a.start)
            const bStart = new Date(b.start)

            if (aStart > bStart) {
                return -1
            } else if (aStart < bStart) {
                return 1
            }
            return 0
        }
        return resp.data.tasks.sort(compareTasksDate);
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

const addTask = async(projectId, { detail, start }) => {
    const resp = await axios.post("/api/projects/" + projectId + "/tasks", { detail, start })
    return resp.status
}

const updateTask = async(projectId, taskId, { detail, start, milliseconds, finish }) => {
    const resp = await axios.put("/api/projects/" + projectId + "/tasks/" + taskId, { detail, start, milliseconds, finish })
    return resp.status
}

const deleteTask = async(projectId, taskId) => {
    const resp = await axios.delete("/api/projects/" + projectId + "/tasks/" + taskId);
    return resp.status
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
    deleteTask
}