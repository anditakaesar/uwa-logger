import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import logger from './logger';

const app = express();

app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));

// router
app.use('/user', require('./authrouter').default);
app.use('/log', require('./logrouter').default);

app.use((err, req, res, next) => {
    if (err) {
        logger.error(err.message, { intmsg: err.intmsg });

        res.status(err.status).json({
            message: err.message
        });
    }
});

export default app;