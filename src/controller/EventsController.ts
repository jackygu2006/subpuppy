import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Events} from "../entity/Events";
import { nullObject, parseEvent, parseEvents, parseRewardSlash } from "./services/parse";

export class EventsController {

  private eventsRepository = getRepository(Events);
  
  async getRewardSlash(request: Request, response: Response, next: NextFunction) {
      const req = request.body;
      const row = req.row;
      const page = req.page;
      const address = req.address;
      
      if(page === undefined || row === undefined || address === undefined) return nullObject;

      const type = "0601"; // module is staking, event is Reward
      const where = address !== undefined ? `and match(params) against('${address}')` : '';
      const sql = `select * from events where type = '${type}' ${where} order by block_num desc limit ${page}, ${row}`;
      const result: Array<Events> = await this.eventsRepository.query(sql);
      if(result.length === 0) return nullObject;
      else return await parseRewardSlash(this.eventsRepository, result);
  }

  async getEvents(request: Request, response: Response, next: NextFunction) {
    const req = request.body;
    const row = req.row;
    const page = req.page;
    const module = req.module;
    const call = req.call;
    const block_num = req.block_num;
    const extrinsic_index = req.extrinsic_index;

    if(page === undefined || row === undefined) return nullObject;

    // ###### 需要改成通过type查询
    const where_module = module !== undefined ? `and call_module = '${module}'` : '';
    const where_call = call !== undefined ? `and call_module_function = '${call}'` : '';
    const where_block_num = block_num !== undefined ? `and block_num = ${block_num}` : '';
    const where_extrinsic_index = extrinsic_index !== undefined ? `and extrinsic_index = '${extrinsic_index}'`: '';

    const sql = `select * from events where id > 0 ${where_module} ${where_call} ${where_block_num} ${where_extrinsic_index} order by block_num desc limit ${page}, ${row}`;
    const result: Array<Events> = await this.eventsRepository.query(sql);
    if(result.length === 0) return nullObject;
    else return parseEvents(result);
  }

  async getEvent(request: Request, response: Response, next: NextFunction) {
    const req = request.body;
    const event_index = req.event_index;

    if(event_index == undefined) return nullObject;

    const sql = `select * from events where event_index = '${event_index}' limit 1`;
    const result: Array<Events> = await this.eventsRepository.query(sql);
    if(result.length === 0) return nullObject;
    else return parseEvent(result[0]);
  }

  async getStakingHistory(request: Request, response: Response, next: NextFunction) {
    const req = request.body;
    const row = req.row;
    const page = req.page;
    const address = req.address;
    const from_block = req.from_block;
    const to_block = req.to_block;

    if(address === undefined) return nullObject;

    const type = "0601"; // module is staking, event is Reward
    const where_address = address !== undefined ? `and match(params) against('${address}')` : '';
    const where_from = from_block !== undefined ? `and block_num >= ${from_block}` : '';
    const where_to = to_block !== undefined ? `and block_num <= ${to_block}` : '';
    const limit = row !== undefined && page !== undefined ? `limit ${page}, ${row}` : '';

    const sql = `select * from events where type = '${type}' ${where_address} ${where_from} ${where_to} ${limit}`;
    const result: Array<Events> = await this.eventsRepository.query(sql);
    if(result.length === 0) return nullObject;
    let sum = 0;
    for(let i = 0; i < result.length; i++) {
      const reward = (JSON.parse(result[i].params))[1];
      sum += reward;
    }

    return {
      code: 0,
      message: "Success",
      generated_at: Math.round((new Date()).getTime() / 1000),
      data: {
        sum
      }
    }
  }
}

/*
curl -X POST 'http://127.0.0.1:3000/api/scan/account/reward_slash' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_KEY' \
  --data-raw '{
    "row": 20,
    "page": 1,
    "address": "5GNER3tsmKkv7SmMpKBeKynKgBr5Bf2iriS1pzPFUuH5jehR"
  }'

curl -X POST 'https://kusama.api.subscan.io/api/scan/account/reward_slash' \
  --header 'Content-Type: application/json' \
  --header 'X-API-Key: YOUR_KEY' \
  --data-raw '{
    "row": 20,
    "page": 0,
    "address": "HNPmcMFUenVkonaVBzxknjjZ4uptXNirTamUEfCYp86o1af"
  }'

  */
