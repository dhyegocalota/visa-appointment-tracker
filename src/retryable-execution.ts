import { Logger } from 'winston';
import { AttemptOptions } from '@lifeomic/attempt';
import Execution from '@/execution';
import RetryExecution from '@/retry-execution';

export default abstract class RetryableExecution<TExecutionOutput> implements Execution<TExecutionOutput> {
  protected logger: Logger;

  constructor({ logger }: { logger: Logger }) {
    this.logger = logger;
  }

  abstract retryableExecute(): Promise<TExecutionOutput>;

  execute(): Promise<TExecutionOutput> {
    if (!this.shouldRetry()) {
      return this.retryableExecute();
    }

    const retryableExecute = new RetryExecution({
      logger: this.logger,
      execute: this.retryableExecute.bind(this),
      retryOptions: this.buildRetryOptions(),
    });

    return retryableExecute.execute();
  }

  shouldRetry(): boolean {
    return false;
  }

  buildRetryOptions(): AttemptOptions<TExecutionOutput> | null {
    return null;
  }
}
