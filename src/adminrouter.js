import { Router } from 'express';
import { sequelize } from '../models/index';
import { DataTypes } from 'sequelize';
import moment from 'moment';

const Userlog = require('../models/userlog')(sequelize, DataTypes);

const router = Router();

function getLogs (req, res, next) {

    process.nextTick(() => {
        const { page, limit, calcoffset } = req;

        Userlog.findAndCountAll({
            where: {
                userid: res.data.user.id
            },
            limit: [calcoffset, limit],
            order: [
                ['createdAt', 'DESC']
            ]
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

router.get('/live', (req, res, next) => {
    req.page = req.query.page ? parseInt(req.query.page) : 1;
    req.limit = req.query.limit ? parseInt(req.query.limit) : 100;
    req.calcoffset = (req.page - 1) * req.limit;
    next();

}, getLogs,
(req, res, next) => {
    let tempLog = [];
    res.logs.forEach(v => {
        delete v.rownum;
        v.timestamp = moment(v.timestamp).toISOString();
        tempLog.push({
            message: JSON.stringify(v, null, 2)
        });
    });
    res.data.logs = tempLog;
    res.render('loggerlive', { title: `Live logger for ${res.data.user.username}`, data: res.data });
});

router.get('/profile', (req, res, next) => {
    res.render('profile', { title: `Profile page of ${res.data.user.username}`, data: res.data });
});

export default router;