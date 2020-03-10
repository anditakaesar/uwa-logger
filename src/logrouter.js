import { Router } from 'express';
import { sequelize } from '../models/index';
import { DataTypes } from 'sequelize';
import { genError } from './utils';
import logger from './logger';
import moment from 'moment';
import { checkSession } from './authrouter';

const User = require('../models/user')(sequelize, DataTypes);
const Userlog = require('../models/userlog')(sequelize, DataTypes);

const router = Router();

router.post('/', getUserByApi, (req, res, next) => {
    process.nextTick(() => {
        req.body.timestamp = moment(req.body.timestamp).valueOf();
        req.body.ip = req.ip || req.headers["x-forwarded-for"];
        
        Userlog.create({
            userid: req.user.id,
            logjson: req.body
        })
        .then(userlog => {
            userlog.logjson.timestamp = moment(userlog.logjson.timestamp).toISOString();
            req.io.emit(`log_${req.user.apikey}`, userlog.logjson);
            res.status(201).json({
                message: `new log created`,
                log: userlog.dataValues
            });
        })
        .catch(err => {
            next(genError(`cannot post log`, null, 500));
        });
    });
});

router.get('/', checkSession, getUserByApi, checkLimitPage, getLogs, 
(req, res, next) => {
    res.status(200).json({
        message: `success`,
        logs: res.logs,
        count: res.count,
        page: req.page,
        limit: req.limit,
        totalpage: res.totalpage
    });
});

router.get('/live', checkSession, getUserByApi, (req, res, next) => {
    req.page = req.query.page ? parseInt(req.query.page) : 1;
    req.limit = req.query.limit ? parseInt(req.query.limit) : 100;
    req.calcoffset = (req.page - 1) * req.limit;
    next();
}, getLogs,
(req, res, next) => {
    res.data = {};
    res.data.username = req.session.user.username;
    res.data.apikey = req.session.user.apikey;
    let tempLog = [];
    res.logs.forEach(v => {
        delete v.rownum;
        v.timestamp = moment(v.timestamp).toISOString();
        tempLog.push({
            message: JSON.stringify(v, null, 2)
        });
    });
    res.data.logs = tempLog;
    res.render('loggerlive', { title: `Live logger for ${res.data.username}`, data: res.data });
});

function getUserByApi(req, res, next) {
    if (req.session.user) {
        req.user = req.session.user;
        next();
    } else {
        process.nextTick(() => {
            User.findOne({
                where: {
                    apikey: req.query.apikey
                }
            })
            .then(user => {
                if (!user) {
                    next(genError(`not found`, `api key: "${req.query.apikey}"`, 404));
                }
    
                req.user = user;
                next();
            })
            .catch(err => {
                next(genError(`not found`, err.message, 404));
            });
        });
    }
}

function getLogs (req, res, next) {
    process.nextTick(() => {
        const { page, limit, calcoffset } = req;

        Userlog.findAndCountAll({
            where: {
                userid: req.user.id
            },
            limit: [calcoffset, limit]
        })
        .then(result => {            
            let logs = [];
            let rownum = calcoffset + 1;
            result.rows.forEach(l => {
                l.logjson.rownum = rownum;
                logs.push(l.logjson);
                rownum++;
            });

            res.logs = logs;
            res.totalpage = Math.ceil(result.count / limit);
            res.count = result.count;
            next();
        })
        .catch(err => {
            next(genError(`cannot retrieve all logs`, err.message, 500));
        });
    });
}

function checkLimitPage (req, res, next) {
    req.page = req.query.page ? parseInt(req.query.page) : 1;
    req.limit = req.query.limit ? parseInt(req.query.limit) : 5;
    req.calcoffset = (req.page - 1) * req.limit;
    next();
}

export default router;