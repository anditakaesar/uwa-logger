import { Router } from 'express';
import Umzug from 'umzug';
import { sequelize } from '../models/index';
import Sequelize from 'sequelize';
import { genError } from './utils';
import { env } from './env';
import logger from './logger';

// migration router
const router = Router();

const umzug = new Umzug({
    storage: 'sequelize',
    storageOptions: {
        sequelize: sequelize
    },

    migrations: {
        params: [
            sequelize.getQueryInterface(),
            Sequelize
        ],
        path: './migrations'
    }
});

router.get('/', CheckQueryStringSecret,
GetExecutedMigration, GetPendingMigration,
(req, res, next) => {
    process.nextTick(() => {
        res.status(200).json({
            message: `all migrations`,
            migrations: res.migrations
        });
    });
});

router.post('/:method', CheckQueryStringSecret,
(req, res, next) => {
    const { method } = req.params;
    if (method === 'up') {
        res.donemsg = `migrated`;
        next();
    } else if (method === 'down') {
        res.donemsg = `undo migration`;
        next();
    } else {
        next(genError(`not found`, `method router attempt`, 404));
    }
},
(req, res, next) => {
    process.nextTick(() => {
        let migs = req.body.migrations ? [...req.body.migrations] : [];
        logger.info(`attempt to ${res.donemsg}`, { migrations: migs });
        umzug.execute({
            migrations: migs,
            method: req.params.method
        })
        .then(mgtns => {
            let migrations = [];
            mgtns.forEach(m => migrations.push(m.file));

            res.status(200).json({
                message: res.donemsg,
                migrations: migrations
            });
        })
        .catch(err => {
            next(genError(`error migrating`, err.message));
        });
    });
});

function CheckQueryStringSecret(req, res, next) {
    if (req.query.api === env.MIGRATION_API) {
        next();
    } else {
        next(genError(`not found`, `migration api attempt`, 404));
    }
}

function GetExecutedMigration (req, res, next) {
    process.nextTick(() => {
        umzug.executed()
        .then(mgtd => {
            let migrations = res.migrations ? [...res.migrations] : [];
            
            mgtd.forEach(m => migrations.push({ name: m.file, status: 'migrated' }));
            res.migrations = migrations;

            next();
        })
        .catch(err => {
            next(genError(`Error get executed migrations`, err.message));
        });
    });
}

function GetPendingMigration (req, res, next) {
    process.nextTick(() => {
        umzug.pending()
        .then(pndg => {
            let migrations = res.migrations ? [...res.migrations] : [];

            pndg.forEach(m => migrations.push({ name: m.file, status: 'pending' }));
            res.migrations = migrations;

            next();
        })
        .catch(err => {
            next(genError(`Error get pending migrations`, err.message));
        });
    });
}

export default router;
