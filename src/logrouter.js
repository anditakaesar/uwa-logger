import { Router } from 'express';
import { sequelize } from '../models/index';
import { DataTypes } from 'sequelize';
import { genError } from './utils';
import moment from 'moment';

const User = require('../models/user')(sequelize, DataTypes);
const Userlog = require('../models/userlog')(sequelize, DataTypes);

const router = Router();

router.post('/', getUserIdByApi, (req, res, next) => {

    process.nextTick(() => {
        req.body.timestamp = moment(req.body.timestamp).valueOf();
        req.body.ip = req.ip || req.headers["x-forwarded-for"];

        Userlog.create({
            userid: req.userid,
            logjson: req.body
        })
        .then(userlog => {
            console.log(req.apikey);
            userlog.logjson.timestamp = moment(userlog.logjson.timestamp).toISOString();
            req.io.emit(`log_${req.apikey}`, userlog.logjson);

            res.status(201).json({
                message: `new log created`,
                log: userlog.dataValues
            });
        })
        .catch(err => {
            next(genError(`cannot post log`, err.message, 500));
        });
    });

});

function getUserIdByApi(req, res, next) {

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

            req.userid = user.id;
            req.apikey = req.query.apikey;
            next();
        })
        .catch(err => {
            next(genError(`not found`, err.message, 404));
        });
    });
    
}

export default router;