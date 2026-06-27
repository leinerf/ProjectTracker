import HttpError from "./HttpError.js";

class ResourceBadRequest extends HttpError {
    constructor(resource, method, ...params) {
        super(resource, `Resource: ${resource} recieved invalid data`, 400, method)
    }
}

export default ResourceBadRequest;