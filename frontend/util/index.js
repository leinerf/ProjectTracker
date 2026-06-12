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

export { hourMinSecondsMilli, formatDigit }