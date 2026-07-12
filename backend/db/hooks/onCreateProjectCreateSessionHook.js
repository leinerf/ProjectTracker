import Project from "../models/Project.js";
import Session from "../models/Session.js";

function onCreateProjectCreateSessionHook() {
    Project.addHook('afterCreate', 'createSession', async(project, options) => {
        try {
            await Session.create({ user_id: project.user_id, project_id: project.id })
        } catch (err) {
            console.error(err)
        }
    })

}

export default onCreateProjectCreateSessionHook