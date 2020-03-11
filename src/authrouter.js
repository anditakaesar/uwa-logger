import { Router } from 'express';
import { sequelize } from '../models/index';
import { DataTypes } from 'sequelize';
import { genError } from './utils';
import bcrypt from 'bcrypt';
const User = require('../models/user')(sequelize, DataTypes);

const router = Router();
const generalMsg = `Login failed, please check your username and password`;

router.post('/authorize', (req, res, next) => {
    process.nextTick(() => {
        User.findOne({
            where: {
                username: req.body.username
            }
        })
        .then(user => {
            if (!user) {
                next(genError(generalMsg, `user not found ${req.body.username}`, 401))
            } else {
                bcrypt.compare(req.body.password, user.password, (err, valid) => {
                    if (err) next(genError(generalMsg, err.message, 401));
                    
                    if (!valid) {
                        next(genError(generalMsg, `wrong password attempt ${req.body.username}`, 401))
                    } else {
                        res.status(200).json({
                            message: `login success`,
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                apikey: user.apikey
                            }
                        })
                    }
                });
            }

        })
        .catch(err => next(genError(err.message, ``)));
    });
});

router.post('/login', (req, res, next) => {

    process.nextTick(() => {
        User.findOne({
            where: {
                email: req.body.email
            }
        })
        .then(user => {
            if (!user) {
                next(genError(generalMsg, `user not found "${req.body.email}"`, 401))
            } else {
                bcrypt.compare(req.body.password, user.password, (err, valid) => {
                    if (err) next(genError(generalMsg, err.message, 401));
                    
                    if (!valid) {
                        next(genError(generalMsg, `wrong password attempt ${req.body.username}`, 401))
                    } else {
                        req.session.user = {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            apikey: user.apikey
                        }

                        res.redirect('/');
                    }
                });
            }
        })
        .catch(err => next(genError(err.message, ``)));
    });

});

export function checkSession (req, res, next) {
    if (req.session.user || req.user) {
        next();
    } else {
        res.redirect(`/login`);
    }
}

export default router;