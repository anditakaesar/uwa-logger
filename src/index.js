import 'dotenv/config';
// import app from './app';
import { env } from './env';
import logger from './logger';
import http from './app';

http.listen(env.PORT, () => {
    if (env.NODE_ENV === 'development') {
        logger.info(`app listen at port ${env.PORT}`);
    }
});