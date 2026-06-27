import HttpError from "./HttpError.js";

class ResourceConflictError extends HttpError {
    constructor(resource, method, ...params) {
        super(resource, `Resource: ${resource} has conflict`, 409, method, ...params);
    }
}

export default ResourceConflictError;