import { Router } from 'express';
import { sequelize } from '../models/index';
import { DataTypes } from 'sequelize';
import { genError } from './utils';
import logger from './logger';
import moment from 'moment';

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

router.get('/', getUserByApi, (req, res, next) => {
    process.nextTick(() => {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 5;
        let calcoffset = (page - 1) * limit;
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
            res.status(200).json({
                message: `success`,
                logs: logs,
                count: result.count,
                page: page,
                limit: limit,
                totalpage: Math.ceil(result.count / limit)
            });
        })
        .catch(err => {
            next(genError(`cannot retrieve all logs`, err.message, 500));
        });
    });
});

function getUserByApi(req, res, next) {
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
            next(genError(`error`, err.message, 500));
        });
    });
}

export default router;