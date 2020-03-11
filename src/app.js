import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import { json, urlencoded } from 'body-parser';
import logger from './logger';
import exphbs from 'express-handlebars';
import session from 'express-session';
import path from 'path';
import { Server } from 'http';
import { env } from './env';
import { getCurrentUser, checkSession } from './authrouter';

const app = express();
const http = Server(app);
const io = require('socket.io')(http);

const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'default',
    layoutsDir: path.join(__dirname, '../views/layouts'),
    partialsDir: path.join(__dirname, '../views/partials')
});

// middlewares
app.use(helmet());
app.use(compression());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(session({
    name: env.SESSION_NAME,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: env.SESSION_COOKIE_AGE * 1000, secure: env.SESSION_COOKIE_SECURE }
}));

app.use(express.static(path.join(__dirname, '../static')));

app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine);

// common data: res.data
app.use((req, res, next) => {
    if (req.session.user) {
        res.data = {};
        res.data.user = req.session.user;
    }
    req.io = io;
    next();
});

app.get('/', (req, res, next) => {
    res.render('index', { title: 'Welcome', data: res.data });
});

app.get('/login', (req, res, next) => {
    if (req.user) {
        res.redirect('/');
    } else {
        res.render('login', { title: 'Please Login', data: res.data });
    }
});

app.get('/logout', (req, res, next) => {
    req.session.destroy();
    res.data.user = null;

    res.render('login', { title: 'Please Login', data: res.data });
});

// router
app.use('/user', require('./authrouter').default); // to authenticate / login
app.use('/log', require('./logrouter').default); // to post a log
app.use('/migration', require('./migrationrouter').default); // to migrate
app.use('/admin', checkSession, require('./adminrouter').default); // admin pages

// error handler
app.use((err, req, res, next) => {
    if (err) {
        logger.error(err.message, { intmsg: err.intmsg });

        res.status(err.status).json({
            message: err.message
        });
    }
});

// not found handler
app.use((req, res, next) => {
    res.status(404).json({
        message: `resource not found`
    });
});

export default http;