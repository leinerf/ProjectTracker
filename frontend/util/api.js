import axios from "axios";

const pullProjects = async() => {
    try {
        const resp = await axios.get("/api/projects")
        if (resp.status !== 200) {
            throw new Error("status code not 200: " + resp.status)
        }
        const compareProjectName = (a, b) => {
            if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            }
            return 0
        }
        const compareProjectCompleted = (a, b) => {
            if (!a.completed && b.completed) {
                return -1
            } else if (a.completed && !b.completed) {
                return 1
            }
            return 0
        }
        return resp.data.projects.sort(compareProjectName).sort(compareProjectCompleted);
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

const getProjectsTime = async() => {
    try {
        const resp = await axios.get("/api/projects/time");
        if (resp.status !== 200) {
            throw new Error("status code not 200: " + resp.status)
        }
        return resp.data.time;
    } catch (err) {
        console.error(err);
        return 0;
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

const getTasks = async(projectId) => {
    // gets tasks and sorts them by date
    try {
        const resp = await axios.get("/api/project/" + projectId + "/tasks")
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
    const resp = await axios.post("/api/project/" + projectId + "/task", { detail, start })
    return resp.status
}

const updateTask = async(projectId, taskId, { detail, start, milliseconds, finish }) => {
    const resp = await axios.put("/api/project/" + projectId + "/task/" + taskId, { detail, start, milliseconds, finish })
    return resp.status
}

const deleteTask = async(projectId, taskId) => {
    const resp = await axios.delete("/api/project/" + projectId + "/task/" + taskId);
    return resp.status
}

const getTimeSpentOnProject = async(projectId) => {
    try {
        const resp = await axios.get("/api/project/" + projectId + "/time");
        return resp.data.milliseconds
    } catch (err) {
        console.error(err)
        return null;
    }
}
export {
    pullProjects,
    getProjectsTime,
    getProject,
    addProject,
    updateProject,
    deleteProject,
    getTasks,
    addTask,
    updateTask,
    deleteTask,
    getTimeSpentOnProject
}