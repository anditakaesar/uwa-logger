export const PORT = parseInt(process.env.PORT) || 3000;
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const LOGGER_TAG = process.env.LOGGER_TAG || 'DEVELOP';

export const env = {
    PORT, NODE_ENV, LOGGER_TAG
}