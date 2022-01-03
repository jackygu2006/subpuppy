#! /usr/bin/env node
import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { connect, getLastestHeight, saveValidatorPoint } from './chain/net';
import { logger } from "./logger";
import { program } from "commander";
import { exit } from "process";
import { fetchChainData, getDBHeight } from "./controller/services/db";
import { Blocks } from "./entity/Blocks";
import { debug } from './config';
const log = require('single-line-log').stdout;

let updateAllowed = false;
let fetchingData = false;

/** Commanders: 
 *  fetch: start fetching service
 *  api:   start api service, no options
 *  point: saving validator point data
 *  
 *  options: 
 *  -f: from block height
 *  -t: to block height, default is latest block height
 *  -u: update allowed, default is false
 *  -p: API port
 *  -l: update to latest block
 */

program
    .allowUnknownOption()
    .version('0.1.5')
    .usage('subpuppy fetch [options] or subpuppy api [options]')

program
    .command('fetch [options]')
    .description('Fetch substrate-based blockchain data')
    .option('-f --from <blockHeight>', 'from block height')
    .option('-t --to <blockHeight>', 'to block height')
    .option('-u --update', 'update existed block data allowed', false)
    .option('-l --latest', 'Fetch data until latest block')
    .action((name, options, command) => {
        updateAllowed = options.update;
        createConnection().then(async connection => {
            await connect();
            if(options.latest) {
                setInterval(async() => {
                    if(!fetchingData) {
                        const latestHeight = await getLastestHeight();
                        const dbHeight = await getDBHeight(connection);
                        fetchingData = true;
                        await fetchChainData(
                            connection,
                            dbHeight + 1,
                            latestHeight,
                            updateAllowed
                        )
                        fetchingData = false;
                    }
                }, 8000);
            } else {
                fetchingData = true;
                await fetchChainData(
                    connection, 
                    parseInt(options.from),
                    parseInt(options.to),
                    updateAllowed
                );
                fetchingData = false;
                connection.close();
                exit(0);
            }
        }).catch(error => logger.error(error));
    })

program
    .command('points [options]')
    .description('Saving validator point data')
    .option('-i --interval <interval>', 'interval seconds every fetching', '1800')
    .action((name, options, command) => {
        createConnection().then(async connection => {
            await connect();
            const interval = options.interval;
            setInterval(async() => {
                console.log("saveValidatorPoint");
                await saveValidatorPoint(connection);
            }, parseInt(interval) * 1000);
        })

    })


program
    .command('api [options]')
    .description('Run API service')
    .option('-p --port <Port>', 'API port', '3030')
    .action((name, options, command) => {
        logger.info('Starting API...')
        // create express app
        createConnection().then(async connection => {
            const app = express();
            app.use(bodyParser.json());
            setCors(app);
            await connect();

            Routes.forEach(route => {
                (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                    const result = (new (route.controller as any))[route.action](req, res, next);
                    if (result instanceof Promise) {
                        result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);

                    } else if (result !== null && result !== undefined) {
                        res.json(result);
                    }
                });
            });

            app.listen(parseInt(options.port));
            logger.info(`Express server has started on port ${options.port}.`);
        }).catch(error => console.log(error));
    })

// 以下脚本用于检测有多少块尚未同步
program
    .command('check [options]')
    .description('Check how many blocks not synchronized')
    .option('-f --from <blockHeight>', 'from block height')
    .option('-t --to <blockHeight>', 'to block height')
    .action((name, options, command) => {
        createConnection().then(async (conn) => {
            let count = 0;
            const from = parseInt(options.from);
            const to = parseInt(options.to);
            for(let i = from; i <= to; i++) {
                const sql = `select * from blocks where block_num = ${i} limit 1`;
                const result: Array<Blocks> = await conn.manager.query(sql);
                if(result.length === 0) count++;
                log(`Checking block #${i}, found ${count} (${(count / (i - from + 1) * 100).toFixed(2)}%) not synchronized`);
            }
            console.log(`\nTotal ${count} (${(count / (to - from + 1) * 100).toFixed(2)}%) not synchronized.`)
            conn.close();
            exit();
        }).catch(error => console.log(error));
    })

if(!process.argv[2]) {
    program.help();
}
program.parse(process.argv);

function setCors(app) {
    const cors = require('cors');
    app.use(cors({
        origin: !debug ? 'http://tool.xxnetwork.asia' : 'http://127.0.0.1:3000',
        maxAge: 5,
        credentials: true,
        allowMethods: ['GET', 'POST'],
        allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
        exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
        
      })
    )
}