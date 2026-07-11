import Project from "../models/Project.js";
import Session from "../models/Session.js";

function onProjectCreateSessionHook() {
    Project.addHook('afterCreate', 'createSession', (project, {}) => {
        Session.create({ user_id: project.user_id, project_id: project.id })
    })
}

export default onProjectCreateSessionHook