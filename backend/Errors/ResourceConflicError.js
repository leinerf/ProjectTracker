class ResourceConflictError extends Error {
    constructor(resource, ...params) {
        super(resource, `Resource: ${resource} has conflict`, 409, ...params);
    }
}

export default ResourceConflictError;