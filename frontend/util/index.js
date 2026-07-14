const hourMinSecondsMilli = (milliseconds) => {
    const hour = Math.floor(milliseconds / (60 * 60 * 1000))
    milliseconds -= (hour * 60 * 60 * 1000)
    const min = Math.floor(milliseconds / (60 * 1000))
    milliseconds -= (min * 60 * 1000)
    const sec = Math.floor(milliseconds / 1000)
    milliseconds -= sec * 1000;
    return { hour, min, sec, milliseconds }
}

const formatDigit = (time) => {
    return time.toString().padStart(2, '0');
}

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime)
    return `Date: ${date.getFullYear()}-${formatDigit(date.getMonth() + 1)}-${formatDigit(date.getDate())} Time: ${formatDigit(date.getHours())}:${formatDigit(date.getMinutes())}`
}

export { hourMinSecondsMilli, formatDigit, formatDateTime }