import winston, { Logger } from 'winston';
import { TransformableInfo } from 'logform';
import safeStringify from 'safe-stable-stringify';
import WorkflowExecutionState from '@/workflow-execution-state';
import { Config } from '@/types';

export default function buildDefaultLogger(): Logger {
  return winston.createLogger({
    level: 'debug',
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.metadata(),
      winston.format.timestamp(),
      winston.format.printf((logInfo) => {
        const messageParts = buildLogMessagePartsFromInfo(logInfo);
        const verboseMessageParts = buildVerboseLogMessagePartsFromInfo(logInfo);
        const message = [...messageParts, ...verboseMessageParts].join(' ');

        return message;
      })
    ),
    transports: [new winston.transports.Console()],
  });
}

export function buildLogMessagePartsFromInfo(logInfo: TransformableInfo): String[] {
  const { level, message, timestamp, metadata } = logInfo;
  const executionState = <WorkflowExecutionState | undefined>metadata.executionState;

  if (executionState?.hasInitialized()) {
    const executionStateLabel = executionState.buildLoggerLabel(logInfo);
    return [timestamp, `${level}:`, executionStateLabel, message];
  }

  return [timestamp, `${level}:`, message];
}

export function buildVerboseLogMessagePartsFromInfo(logInfo: TransformableInfo): String[] {
  const { metadata } = logInfo;
  const config = <Config>metadata.config;

  if (config.isVerbose) {
    return [safeStringify(metadata)];
  }

  return [];
}
