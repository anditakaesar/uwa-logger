import { Router } from 'express';
import { sequelize } from '../models/index';
import { DataTypes } from 'sequelize';
import { genError } from './utils';
import bcrypt from 'bcrypt';
const User = require('../models/user')(sequelize, DataTypes);

const router = Router();
const generalMsg = `Login failed, please check your username and password`;

// router.get('/', (req, res, next) => {
//     process.nextTick(() => {
//         User.findAll()
//         .then(users => {
//             let us = [];

//             users.every(user => {
//                 us.push({ id: user.id, username: user.username, email: user.email, password: user.password, apikey: user.apikey });
//             })

//             res.status(200).json({
//                 message: `getting all users`,
//                 users: us
//             });
//         })
//         .catch(err => console.error(err));
//     });
// });

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

export default router;