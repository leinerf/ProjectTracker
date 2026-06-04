import axios from "axios";

const pullTasks = async() => {
    const resp = await axios.get("/api/tasks")
    if (resp.status === 200) {
        const compareTasks = (a, b) => {
            if (a.name < b.name) {
                return -1
            } else if (a.name > b.name) {
                return 1
            }
            return 0
        }
        return resp.data.tasks.sort(compareTasks)
    }
    return null
}

const addTask = async({ name, description }) => {
    const resp = await axios.post("/api/task", { name, description });
    return resp.status
}

const updateTask = async({ name, description, id, completed }) => {
    const resp = await axios.put("/api/task" + "/" + id, { name, description, completed });
    return resp.status
}

const deleteTask = async({ id }) => {
    const resp = await axios.delete("/api/task" + "/" + id);
    return resp.status
}

export { pullTasks, addTask, updateTask, deleteTask }