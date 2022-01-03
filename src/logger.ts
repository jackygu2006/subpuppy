import { createLogger, format, transports} from 'winston';
import safeStringify from 'fast-safe-stringify';
const { combine, metadata, timestamp, printf, colorize, padLevels } = format

export const logger = createLogger({
  level: 'info',
	format: combine(
		colorize({all: true}),		
		timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
		metadata({key: 'content', fillExcept: ['timestamp', 'level', 'message']}),
		padLevels(),
		printf(info => `${info.timestamp} ${info.message}: ${safeStringify(info.content)}`)
	),
	transports: [
    new transports.File({ filename: 'info.log', level: 'info' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
  }));
}
