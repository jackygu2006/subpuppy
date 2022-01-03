import fs = require('fs');
const eventTypes = JSON.parse(fs.readFileSync('./src/chain/types/eventTypes.json').toString()).eventTypes;

export interface EventModule {
	module: string;
	event: string;
}

export function getEventModule(type: string): EventModule {
	let re: EventModule = { module: '', event: '' };
	for(let t in eventTypes) {
			if(eventTypes[t].type === type) {
					re = {
							module: eventTypes[t].module,
							event: eventTypes[t].event,
					}
					break;   
			}
	}
	return re;
}

