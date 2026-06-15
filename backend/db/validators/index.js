const isNotEmptyString = value => {
    if (value.length === 0) {
        throw Error("String must not be empty")
    }
};

export { isNotEmptyString }