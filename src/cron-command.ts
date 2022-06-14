import { Logger } from 'winston';
import cron, { ScheduledTask } from 'node-cron';

export default class CronCommand {
  command: () => any;

  cronExpression: string;

  logger: Logger;

  task?: ScheduledTask;

  constructor({ command, cronExpression, logger }: { command: () => any; cronExpression: string; logger: Logger }) {
    this.command = command;
    this.cronExpression = cronExpression;
    this.logger = logger;
  }

  start() {
    if (this.task) {
      throw new Error('Cron has already started');
    }

    this.logger.debug('Starting cron command...', { cronExpression: this.cronExpression });
    this.task = cron.schedule(this.cronExpression, () => {
      this.command();
    });
  }

  stop() {
    if (!this.task) {
      throw new Error('Cron has not started');
    }

    this.logger.debug('Stopping cron command...', { cronExpression: this.cronExpression });
    this.task.stop();
    this.task = undefined;
  }
}
