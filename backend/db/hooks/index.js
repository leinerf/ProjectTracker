import onCompleteTaskUpdateSessionHook from "./onCompleteTaskUpdateSessionHook.js";
import onCreateProjectCreateSessionHook from "./onCreateProjectCreateSessionHook.js"
import onCreateTaskUpdateSessionHook from "./onCreateTaskUpdateSessionHook.js";
import onDestroyProjectDestroySessionHook from "./onDestroyProjectDestroySession.js";
import onDestroyTaskUpdateSession from "./onDestroyTaskUpdateSessionHook.js";

function addHooks() {
    const hooks = [
        onCreateProjectCreateSessionHook,
        onCreateTaskUpdateSessionHook,
        onCompleteTaskUpdateSessionHook,
        onDestroyProjectDestroySessionHook,
        onDestroyTaskUpdateSession
    ]
    hooks.forEach(hook => hook())
}

export default addHooks;