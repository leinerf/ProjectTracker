import Task from "../models/Task.js";
import Session from "../models/Session.js";

function onCreateTaskUpdateSessionHook() {
    Task.addHook('afterCreate', 'createSession', async(task, options) => {
        try {
            const session = await Session.findOne({ where: { user_id: task.user_id, project_id: task.project_id } })
            session.task_id = task.id
            session.save()
        } catch (err) {
            console.error(err)
        }
    })
}

export default onCreateTaskUpdateSessionHook