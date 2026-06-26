import HttpError from "./HttpError.js";

class ResourceNotFound extends HttpError {
    constructor(resource, ...params) {
        super(resource, `Resource: ${resource} not found`, 404, ...params);
    }

}

export default ResourceNotFound;