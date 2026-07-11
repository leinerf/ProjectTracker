import onProjectCreateSessionHook from "./onProjectCreateSessionHook.js"

function addHooks() {
    const hooks = [onProjectCreateSessionHook]
    hooks.forEach(hook => hook())
}


export default addHooks;