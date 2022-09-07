import { Logger } from 'winston';
import cron, { ScheduledTask } from 'node-cron';

export default class CronExecution {
  private execute: () => any;

  private cronExpression: string;

  private logger: Logger;

  private scheduledTask?: ScheduledTask;

  constructor({ execute, cronExpression, logger }: { execute: () => any; cronExpression: string; logger: Logger }) {
    this.execute = execute;
    this.cronExpression = cronExpression;
    this.logger = logger.child({
      cronExpression: this.cronExpression,
    });
  }

  start() {
    if (this.scheduledTask) {
      throw new Error('Cron has already started');
    }

    this.logger.debug('Starting cron...');
    this.scheduledTask = cron.schedule(this.cronExpression, () => {
      this.execute();
    });
  }

  stop() {
    if (!this.scheduledTask) {
      throw new Error('Cron has not started');
    }

    this.logger.debug('Stopping cron...');
    this.scheduledTask.stop();
    this.scheduledTask = undefined;
  }
}
