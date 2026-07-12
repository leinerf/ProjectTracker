import Session from "../models/Session.js";
import Task from "../models/Task.js";

function onCompleteTaskUpdateSessionHook() {
    Task.addHook("afterUpdate", "updateSession", async(task, options) => {
        try {
            if (task.complete !== null) {
                const session = await Session.findOne({ where: { task_id: task.id } })
                session.task_id = null
                await session.save()
            }
        } catch (err) {
            console.error(err);
        }
    })
}

export default onCompleteTaskUpdateSessionHook;