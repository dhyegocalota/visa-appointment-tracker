import { Page } from 'puppeteer';
import { Logger } from 'winston';
import { Config } from '@/types';

export default abstract class WorkflowCommand<TInput = any, TOutput = any> {
  logger: Logger;

  config: Config;

  page: Page;

  constructor({ logger, config, page }: { logger: Logger; config: Config; page: Page }) {
    this.logger = logger;
    this.config = config;
    this.page = page;
  }

  abstract getId(): string;

  abstract execute(input: TInput): Promise<TOutput>;
}
