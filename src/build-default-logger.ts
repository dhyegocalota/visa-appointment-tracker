import winston, { Logger } from 'winston';

export default function buildDefaultLogger(): Logger {
  return winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.colorize(), winston.format.timestamp(), winston.format.simple()),
    transports: [new winston.transports.Console()],
  });
}
