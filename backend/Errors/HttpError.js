class HttpError extends Error {
    constructor(resource, msg, status, method, ...params) {
        super(...params);
        this.resource = resource;
        this.msg = msg;
        this.status = status;
        this.method = method; // RESTAPI VERBS [get, post, patch, put, delete]
    }
    toJSON() {
        return { error: this.msg, resource: this.resource, method: this.method }
    }
}

export default HttpError;