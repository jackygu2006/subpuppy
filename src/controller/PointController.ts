import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {Point} from "../entity/Point";
import { nullObject, parsePoint } from "./services/parse";

export class PointController {

    private poinRepository = getRepository(Point);
    
    async getPoints(request: Request, response: Response, next: NextFunction) {
        const req = request.body;
        const validator = req.validator;
        const era_from = req.era_from;
        const era_to = req.era_to;

        if(validator === undefined || era_from === undefined || era_to === undefined || era_from > era_to) return nullObject;

        const sql = `select * from point where validator = '${validator}' and era >= ${era_from} and era <= ${era_to} order by timestamp`;
        const result: Array<Point> = await this.poinRepository.query(sql);
        if(result.length === 0) return nullObject;
        else return parsePoint(result);
    }
}
