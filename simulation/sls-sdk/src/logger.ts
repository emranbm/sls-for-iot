import { createLogger, format, transports } from 'winston'
import * as config from './config.json'

const logger = createLogger({
    level: config.logLevel,
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
    ),
    defaultMeta: { service: 'sls-sdk' },
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                format.simple(),
                format.printf(({ level, message, service, timestamp }) => {
                    return `${timestamp} [${service}] ${level}: ${message}`;
                })
            )
        })
    ]
});

export default logger
