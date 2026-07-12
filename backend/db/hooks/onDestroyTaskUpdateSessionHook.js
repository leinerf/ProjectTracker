import Session from "../models/Session.js"
import Task from "../models/Task.js"

function onDestroyTaskUpdateSession() {
    Task.addHook("beforeDestroy", "updateSession", async(task, options) => {
        try {
            const session = await Session.findOne({ where: { task_id: task.id } })
            if (session !== null) {
                session.task_id = null
                await session.save()
            }
        } catch (err) {
            console.error(err);
        }

    })
}
export default onDestroyTaskUpdateSession