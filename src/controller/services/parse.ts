import { Repository } from "typeorm";
import { Blocks } from "../../entity/Blocks";
import { Events } from "../../entity/Events";
import { Extrinsics } from "../../entity/Extrinsics";
import { Point } from "../../entity/Point";
import { EventModule, getEventModule } from "../types/EventModule";
import { getBlockTimestamp } from "./db";

export async function parseRewardSlash(repo: Repository<Events> ,data: Array<Events>) {
	let events = [];
	for(let i = 0; i < data.length; i++) {
			const event: Events = data[i];
			const eventModule: EventModule = getEventModule(event.type);
			const params = JSON.parse(event.params);

			const dat = {
					account: params[0],
					amount: params[1].toString(),
					block_num: event.block_num,
					block_timestamp: await getBlockTimestamp(repo, event.block_num),
					event_id: eventModule.event,
					event_idx: event.event_idx,
					event_index: event.event_index,
					extrinsic_hash: event.extrinsic_hash, // TODO 暂时不用
					extrinsic_idx: event.extrinsic_idx, // TODO 暂时不用
					module_id: eventModule.module,
					params: JSON.stringify([{
							"type": "[U8; 32]", 
							"value": params[0],
					}, {
							"type": "U128",
							"value": params[1].toString(),
					}]),
					stash: params[0],
			}
			events.push(dat);
	}
	return {
			code: 0,
			message: "Success",
			generated_at: Math.round((new Date()).getTime() / 1000),
			data: {
					count: events.length,
					list: events
			}
	}
}

export function parseExtrinsics(data: Array<Extrinsics>) {
	let extrinsics = [];
	for(let i = 0; i < data.length; i++) {
			const extrinsic: Extrinsics = data[i];
			extrinsics.push({
					account_display:    extrinsic.account_id,
					account_id:         extrinsic.account_id,
					account_index:      '',
					block_num:          extrinsic.block_num,
					block_timestamp:    extrinsic.block_timestamp,
					call_module:        extrinsic.call_module,
					call_module_function: extrinsic.call_module_function,
					extrinsic_hash:     extrinsic.extrinsic_hash,
					extrinsic_index:    extrinsic.extrinsic_index,
					fee:                extrinsic.fee.toString(),
					nonce:              extrinsic.nonce,
					params:             JSON.stringify([{
																	"name": extrinsic.call_module_function, 
																	"type": "Vec<sp_runtime:multiaddress:MultiAddress>", 
																	"value": [ {
																			"Id": extrinsic.params.substr(1, extrinsic.params.length - 2)
																	}]
															}]),
					signature:          extrinsic.signature,
					success:            extrinsic.success == 1 ? true : false,
			})
	}
	return {
			code: 0,
			message: "Success",
			generated_at: Math.round((new Date()).getTime() / 1000),
			data: {
					count: extrinsics.length,
					extrinsics,
			}
	}
}

export function parseTransfersData(data: Array<Extrinsics>) {
	let transfers = [];
	for(let i = 0; i < data.length; i++) {
			const extrinsic: Extrinsics = data[i];
			transfers.push({
					amount:             (parseInt(extrinsic.params.split(',')[1]) / 1e9).toString(),
					block_num:          extrinsic.block_num,
					block_timestamp:    extrinsic.block_timestamp,
					extrinsic_index:    extrinsic.extrinsic_index,
					fee:                extrinsic.fee,
					from:               extrinsic.account_id,
					from_account_display: {
							address: extrinsic.account_id,
							display: "",
							judgements: null,
							account_index: "",
							identity: false,
							parent: null,
					},
					hash:               extrinsic.extrinsic_hash,
					module:             extrinsic.call_module,
					nonce:              extrinsic.nonce,
					success:            extrinsic.success === 1,
					to:                 extrinsic.params.split(',')[0],
					to_account_display: {
							address: extrinsic.params.split(',')[0],
							display: "",
							judgements: null,
							account_index: "",
							identity: false,
							parent: null,
					}
			})
	}

	return {
			code: 0,
			message: "Success",
			generated_at: Math.round((new Date()).getTime() / 1000),
			data: {
					count: transfers.length,
					transfers,
			}
	}
}

export function parseBlocks(data: Array<Blocks>) {
	let blocks = [];
	for(let i = 0; i < data.length; i++) {
		const block: Blocks = data[i];
		blocks.push({
			block_num: block.block_num,
			block_timestamp: block.block_timestamp,
			event_count: block.event_count,
			extrinsics_count: block.extrinsics_count,
			finalized: block.finalized == 1,
			hash: block.hash,
			validator: block.validator,
			validator_index_ids: '', // TODO
			validator_name: '', // TODO
			account_display: {
				account_index: '',
				address: block.validator,
				display: '',
				identity: false,
				judgements: null,
				parent: block.parent_hash,
				parent_display: ''
			}
		})
	}

	return {
		code: 0,
		message: "Success",
		generated_at: Math.round((new Date()).getTime() / 1000),
		data: {
			count: blocks.length,
			blocks
		}
	}
}

export function parseBlock(block: Blocks) {
	// TODO
	return nullObject;
}

export function parseExtrinsic(extrinsic: Extrinsics) {
	// TODO
	return nullObject;
}

export function parseEvents(events: Array<Events>) {
	// TODO
	return nullObject;
}

export function parseEvent(event: Events) {
	// TODO
	return nullObject;
}

export const nullObject = {
	code: 0,
	message: "Success",
	generated_at: Math.round((new Date()).getTime() / 1000),
	data: {
		count: 0,
	},
};

export function parsePoint(data: Array<Point>) {
	let points = [];
	for(let i = 0; i < data.length; i++) {
		const point: Point = data[i];
		points.push({
			validator: point.validator,
			point: point.point,
			era: point.era,
			ratio: point.ratio / 1000000,
			timestamp: point.timestamp
		})
	}

	return {
		code: 0,
		message: "Success",
		generated_at: Math.round((new Date()).getTime() / 1000),
		data: {
			count: points.length,
			points
		}
	}	
}