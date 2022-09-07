import { AttemptContext, AttemptFunction, AttemptOptions, retry } from '@lifeomic/attempt';
import { Logger } from 'winston';
import merge from 'lodash.merge';
import Execution from '@/execution';

export default class RetryExecution<TExecutionOutput> implements Execution<TExecutionOutput> {
  private logger: Logger;

  private retryExecute: AttemptFunction<TExecutionOutput>;

  private retryOptions: AttemptOptions<TExecutionOutput> | null;

  constructor({
    logger,
    execute,
    retryOptions,
  }: {
    logger: Logger;
    execute: AttemptFunction<TExecutionOutput>;
    retryOptions: AttemptOptions<TExecutionOutput> | null;
  }) {
    this.retryExecute = execute;
    this.retryOptions = retryOptions;
    this.logger = logger.child({
      retryOptions: this.retryOptions,
    });
  }

  public execute(): Promise<TExecutionOutput> {
    return retry(this.retryExecute, this.buildRetryOptions());
  }

  private buildRetryOptions(): Partial<AttemptOptions<TExecutionOutput>> {
    return merge(this.retryOptions, {
      beforeAttempt: this.beforeAttempt,
    });
  }

  private beforeAttempt = (context: AttemptContext, options: AttemptOptions<TExecutionOutput>) => {
    this.logger.debug(`Executing attempt number ${context.attemptNum + 1} of ${options.maxAttempts}...`);

    if (this.retryOptions?.beforeAttempt) {
      this.retryOptions.beforeAttempt(context, options);
    }
  };
}
