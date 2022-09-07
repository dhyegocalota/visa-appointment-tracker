import { Page } from 'puppeteer';
import { Logger } from 'winston';
import { Config } from '@/types';
import ExecutionState from '@/execution-state';
import RetryableExecution from '@/retryable-execution';

export default abstract class WorkflowCommand<TExecutionState extends ExecutionState> extends RetryableExecution<void> {
  protected config: Config;

  protected page: Page;

  protected executionState: TExecutionState;

  constructor({
    logger,
    config,
    page,
    executionState,
  }: {
    logger: Logger;
    config: Config;
    page: Page;
    executionState: TExecutionState;
  }) {
    super({ logger });

    this.config = config;
    this.page = page;
    this.executionState = executionState;
    this.logger = this.logger.child({
      commandId: this.getId(),
      config: this.config,
      executionState: this.executionState,
    });
  }

  static getId(): string {
    throw new Error('Command ID is undefined');
  }

  getId(): string {
    return (<typeof WorkflowCommand>this.constructor).getId();
  }
}
