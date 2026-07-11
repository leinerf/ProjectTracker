import Project from "./models/Project.js";
import Task from "./models/Task.js";
import User from "./models/User.js";
import Session from "./models/Session.js";
import addHooks from "./hooks/index.js";

addHooks();

const db = {
    User,
    Project,
    Task,
    Session
}
export default db;