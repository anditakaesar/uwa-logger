export const PORT = parseInt(process.env.PORT) || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const LOGGER_TAG = process.env.LOGGER_TAG || 'DEVELOP';
export const MIGRATION_API = process.env.MIGRATION_API || '';
export const SESSION_NAME = process.env.SESSION_NAME || 'session';
export const SESSION_SECRET = process.env.SESSION_SECRET || 'very-hard-secret';
export const SESSION_COOKIE_AGE = parseInt(process.env.SESSION_COOKIE_AGE) || 86400;
export const SESSION_COOKIE_SECURE = _equalString(process.env.SESSION_COOKIE_SECURE, 'true') ? true : false;

export const env = {
    PORT, 
    NODE_ENV, 
    LOGGER_TAG,
    MIGRATION_API,
    SESSION_NAME,
    SESSION_SECRET,
    SESSION_COOKIE_AGE,
    SESSION_COOKIE_SECURE
}

function _equalString (str, comparer) {
    if (str.toLowerCase() === comparer) {
        return true;
    } else {
        return false;
    }
}