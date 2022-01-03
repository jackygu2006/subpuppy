import { BlockHash } from '@polkadot/types/interfaces';
import { Connection, Repository } from 'typeorm';
import { fetchBlocks, fetchEvents, fetchExtrinsics, getBlockHash } from '../../chain/net';
import { ChainData, PointData, SubBlock, SubEvent, SubExtrinsic } from '../../chain/types/types';
import { Blocks } from '../../entity/Blocks';
import { Events } from '../../entity/Events';
import { Extrinsics } from '../../entity/Extrinsics';
import { Point } from '../../entity/Point';
import { logger } from '../../logger';

export async function getBlockTimestamp(repo: Repository<Events>, height: number): Promise<number> {
	const timestamp: Array<Blocks> = await repo.query(`SELECT * FROM blocks WHERE block_num = ${height} limit 1`);
	return timestamp[0].block_timestamp;
}

export async function getDBHeight(conn: Connection): Promise<number> {
	const sql = "select * from blocks order by block_num desc limit 1";
	const record: Array<Blocks> = await conn.manager.query(sql);
	return record[0].block_num;
}

export async function fetchChainData(conn: Connection, startBlockHeight: number, endBlockHeight: number, updateAllowed: boolean) {
	if(endBlockHeight < startBlockHeight) return;

	for (let i = 0; i <= endBlockHeight - startBlockHeight; i++) {
			const h: number = startBlockHeight + i;
			if(await checkIfExists(conn, h) && !updateAllowed) continue;
			const blockHash: BlockHash = await getBlockHash(h);
			const block: SubBlock = await fetchBlocks(h, blockHash);
			if(block == null) continue;
			const extrinsics: Array<SubExtrinsic> = await fetchExtrinsics(h, blockHash);
			const events: Array<SubEvent> = await fetchEvents(h, blockHash);
			await saveChainData({
					block,
					extrinsics,
					events
			}, conn,
			updateAllowed);
	}
}

async function checkIfExists(conn: Connection, height: number): Promise<boolean> {
	const record: Blocks = await conn.manager.findOne(Blocks, {block_num: height});
	return record != null;
}

async function saveChainData(chainData: ChainData, conn: Connection, updateAllowed: boolean) {
	let action = '';
	try {
			// Blocks
			const record: Blocks = await conn.manager.findOne(Blocks, { hash: chainData.block.hash });
			if(record == null) {
					action = 'Add';
					await conn.manager.save(conn.manager.create(Blocks, chainData.block));
			} else if (updateAllowed) {
					action = 'Update';
					await conn.manager.update(Blocks, record.id, { ...chainData.block });
			} else {
					logger.info(`Pass Block Data #${chainData.block.block_num} Hash: ${chainData.block.hash} OK`);
					return;
			}

			if(action !== '') {
					// Extrinsics
					for(let i = 0; i < chainData.extrinsics.length; i++) {
							const record: Extrinsics = await conn.manager.findOne(Extrinsics, { 
									extrinsic_index: chainData.extrinsics[i].extrinsic_index 
							})
							if(record == null) {
									await conn.manager.save(conn.manager.create(Extrinsics, chainData.extrinsics[i]));
							} else if (updateAllowed) {
									await conn.manager.update(Extrinsics, record.id, { ...chainData.extrinsics[i]});
							}
					}

					// Events
					for(let i = 0; i < chainData.events.length; i++) {
							const record: Events = await conn.manager.findOne(Events, {
									event_index: chainData.events[i].event_index
							})
							if(record == null) {
									await conn.manager.save(conn.manager.create(Events, chainData.events[i]));
							} else if (updateAllowed) {
									await conn.manager.update(Events, record.id, { ...chainData.events[i] });
							}
					}
					logger.info(`${action} Block Data #${chainData.block.block_num} Hash: ${chainData.block.hash} OK`);
			}
	} catch (error) {
			logger.error(`ERROR #${chainData.block.block_num} ${error.message}`);
	}
}

export function keySort(key: string | number,sortType: boolean) {
	return function(a,b){
		if (typeof a[key]==='number' && typeof b[key]==='number') {
				return sortType ? (b[key]-a[key]) : (a[key]-b[key]);
		}
		else if (typeof a[key]==='string' && typeof b[key]==='string') {
				let x = a[key].toLowerCase();
				let y = b[key].toLowerCase();
				if (x < y) {return sortType ?1:-1;}
				if (x > y) {return sortType ?-1:1;}
				return 0;
		}
		else {
				return 0;
		}
	}
}

export async function saveValidatorPointDB(pointData: PointData, conn: Connection): Promise<boolean> {
	try {
		await conn.manager.save(conn.manager.create(Point, pointData));
		return true;
	} catch (err) {
		logger.error(`ERROR Saving point data of #${pointData.validator} ${err.message}`);
		return false;
	}
}