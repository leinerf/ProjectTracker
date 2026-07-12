import Project from "../models/Project.js";
import Session from "../models/Session.js";
import Task from "../models/Task.js";

function onDestroyProjectDestroySessionHook() {
    try {
        Project.addHook('beforeDestroy', 'destroySession', async(project, options) => {
            await Session.destroy({ where: { user_id: project.user_id, project_id: project.id } })
            await Task.destroy({ where: { user_id: project.user_id, project_id: project.id } })
        })
    } catch (err) {
        console.error(err)
    }
}

export default onDestroyProjectDestroySessionHook