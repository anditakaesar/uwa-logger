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
                body: userlog.dataValues
            });
        })
        .catch(err => {
            next(genError(`cannot post log`, null, 500));
        });
    });
});

router.get('/', getUserByApi, (req, res, next) => {
    process.nextTick(() => {
        Userlog.findAll({
            where: {
                userid: req.user.id
            }
        })
        .then(results => {
            // console.log(results);
            let logs = [];
            results.forEach(l => {
                logs.push(l.logjson);
            });
            res.status(200).json({
                message: `success`,
                logs: logs
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