import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import logger from './logger';
import exphbs from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import { checkSession } from './authrouter';
import { Server } from 'http';

const app = express();
const http = Server(app);
const io = require('socket.io')(http);

const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials')
});

app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(session({
    name: 'this.sess',
    secret: 'a-really-strong-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400 * 1000, secure: false }
}));

app.use(express.static(path.join(__dirname, '../static')));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Welcome', data: res.data });
});

app.get('/login', (req, res, next) => {
    if (req.session.user) {
        res.redirect('/log/live');
    } else {
        res.render('login', { title: 'Please Login', data: res.data });
    }
});

app.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.render('login', { title: 'Please Login', data: res.data });
});

// router
app.use('/user', require('./authrouter').default);
app.use('/log', require('./logrouter').default);
app.use('/migration', require('./migrationrouter').default);

app.use((err, req, res, next) => {
    if (err) {
        logger.error(err.message, { intmsg: err.intmsg });

        res.status(err.status).json({
            message: err.message
        });
    }
});

app.use((req, res, next) => {
    res.status(404).json({
        message: `resource not found`
    });
});

// export { http as httpServer };
// export default app;
export default http;