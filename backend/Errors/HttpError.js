class HttpError extends Error {
    constructor(resource, msg, status, ...params) {
        super(...params);
        this.resource = resource;
        this.msg = msg;
        this.status = status;
    }
}

export default HttpError;