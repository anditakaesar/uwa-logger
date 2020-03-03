import { Router } from 'express';
import { sequelize } from '../models/index';
import { DataTypes } from 'sequelize';
import { genError } from './utils';
import logger from './logger';

const User = require('../models/user')(sequelize, DataTypes);
const Userlog = require('../models/userlog')(sequelize, DataTypes);

const router = Router();

router.post('/', getUserByApi, (req, res, next) => {
    process.nextTick(() => {
        if (!req.user) {
            next(genError(`cannot post log`, `no user found using apikey: ${req.body.apikey}`, 401));
        } else {
            delete req.body['apikey'];

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
        }
    });
});

function getUserByApi(req, res, next) {
    process.nextTick(() => {
        User.findOne({
            where: {
                apikey: req.body.apikey
            }
        })
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            next(genError(`error post new log`, err.message, 500));
        });
    });
}

export default router;