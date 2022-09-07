import puppeteer, { Browser, Page } from 'puppeteer';
import { Logger } from 'winston';
import merge from 'lodash.merge';
import WorkflowCommand from '@/workflow-command';
import CronExecution from '@/cron-execution';
import { Config, DeepPartial, Env } from '@/types';
import WorkflowExecutionState from '@/workflow-execution-state';
import RetryableExecution from '@/retryable-execution';

export default abstract class Workflow<
  TExecutionState extends WorkflowExecutionState = WorkflowExecutionState
> extends RetryableExecution<void> {
  protected config: Config;

  protected puppeteer;

  private executionState: TExecutionState;

  private browser?: Browser;

  private page?: Page;

  private cronExecution?: CronExecution;

  static getId(): string {
    throw new Error('Workflow ID is undefined');
  }

  constructor({ config, logger }: { config: Config; logger: Logger }) {
    super({ logger });

    this.config = merge(this.buildDefaultConfig(), config);
    this.puppeteer = puppeteer;
    this.executionState = this.buildExecutionState();
    this.logger = this.logger.child({
      workflowId: this.getId(),
      config: this.config,
      executionState: this.executionState,
    });
  }

  buildDefaultConfig(): DeepPartial<Config> {
    return {};
  }

  async retryableExecute(): Promise<void> {
    try {
      this.executionState.init();
      this.logger.debug('Initializing workflow...');

      const page = await this.getOrBuildPage();
      const commands = this.buildCommands({
        logger: this.logger,
        page,
        executionState: this.executionState,
      });

      this.executionState.setTotalOfCommands(commands.length);
      this.executionState.initCommands();

      await this.executeCommands(commands);
    } finally {
      this.executionState.finishCommands();

      await this.destroyPage();
      await this.destroyBrowser();

      this.logger.debug('Finishing workflow...');
      this.executionState.finish();
    }
  }

  abstract buildExecutionState(): TExecutionState;

  getId(): string {
    return (<typeof Workflow>this.constructor).getId();
  }

  abstract buildCommands({
    logger,
    page,
    executionState,
  }: {
    logger: Logger;
    page: Page;
    executionState: TExecutionState;
  }): WorkflowCommand<TExecutionState>[];

  private async executeCommands(commands: WorkflowCommand<TExecutionState>[]): Promise<void> {
    for (const nextCommand of commands) {
      this.executionState.nextCommand();

      this.logger.debug('Initializing workflow command...');

      await nextCommand.execute();

      this.logger.debug('Finishing workflow command...');
    }
  }

  private async getOrBuildPage(): Promise<Page> {
    if (!this.page) {
      this.page = await this.buildPage();
    }

    return this.page;
  }

  protected async buildPage(): Promise<Page> {
    const browser = await this.getOrBuildBrowser();

    this.logger.debug('Initializing browser page...');
    const [page] = await browser.pages();
    page.setDefaultTimeout(this.config.defaultPuppeteerTimeout);

    return page;
  }

  private async getOrBuildBrowser(): Promise<Browser> {
    if (!this.browser) {
      this.browser = await this.buildBrowser();
    }

    return this.browser;
  }

  private buildBrowser(): Promise<Browser> {
    const browserOptions = this.buildBrowserOptions();
    this.logger.debug('Launching browser...', { browserOptions });

    return puppeteer.launch(browserOptions);
  }

  private buildBrowserOptions(): any {
    if (this.config.env === Env.DEVELOPMENT) {
      return {
        headless: false,
        defaultViewport: { width: 1024, height: 768 },
      };
    }

    return {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    };
  }

  private async destroyPage(): Promise<void> {
    if (!this.page) {
      throw new Error('Page has not been initializsed');
    }

    this.logger.debug('Destroying browser page...');
    await this.page.close();
    this.page = undefined;
  }

  private async destroyBrowser(): Promise<void> {
    if (!this.browser) {
      throw new Error('Browser has not been initializsed');
    }

    this.logger.debug('Destroying browser...');
    await this.browser.close();
    this.browser = undefined;
  }

  public getOrBuildCronExecution(): CronExecution {
    if (!this.cronExecution) {
      this.cronExecution = new CronExecution({
        execute: async () => {
          await this.execute();
        },
        cronExpression: this.buildCronExpression(),
        logger: this.logger,
      });
    }

    return this.cronExecution;
  }

  public abstract buildCronExpression(): string;
}
