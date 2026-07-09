// update tables
import User from "../models/User.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

[User, Task, Project].forEach(table => {
    table.sync()
})