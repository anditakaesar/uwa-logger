export const genError = (message, intmsg, status = 500) => {
    let error = new Error(message);
    error.intmsg = intmsg;
    error.status = status;

    return error;
}