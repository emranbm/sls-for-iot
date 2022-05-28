import { createLogger, format, transports } from 'winston'

let _clientId = "Unknown Client"

export function setClientIdForLogs(clientId: string) {
    _clientId = clientId
}

const logger = createLogger({
    level: "info",
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
                    return `[${_clientId}] ${level}: ${message}`;
                })
            )
        })
    ]
});

export default logger
