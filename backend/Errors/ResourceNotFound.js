import HttpError from "./HttpError.js";

class ResourceNotFound extends HttpError {
    constructor(resource, method, ...params) {
        super(resource, `Resource: ${resource} not found`, 404, method, ...params);
    }

}

export default ResourceNotFound;