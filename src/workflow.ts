import puppeteer, { Browser, Page } from 'puppeteer';
import { Logger } from 'winston';
import WorkflowCommand from '@/workflow-command';
import CronCommand from '@/cron-command';
import { Config, Env } from '@/types';
import buildDefaultLogger from '@/build-default-logger';

export default abstract class Workflow<TInput = any, TOutput = any> {
  config: Config;

  puppeteer;

  logger: Logger;

  browser?: Browser;

  page?: Page;

  cronCommand?: CronCommand;

  constructor({ config, logger }: { config: Config; logger?: Logger }) {
    this.config = config;
    this.puppeteer = puppeteer;
    this.logger = logger || buildDefaultLogger();
  }

  abstract buildCommands({ logger, page }: { logger: Logger; page: Page }): WorkflowCommand[];

  async execute(initialInput?: TInput): Promise<TOutput> {
    this.logger.debug('Initializing workflow execution...', { initialInput });

    const page = await this.getOrBuildPage();
    let output: TOutput;

    try {
      output = await this.executeCommands({ page, initialInput });
    } finally {
      await this.destroyPage();
      await this.destroyBrowser();
    }

    this.logger.debug('Finishing workflow execution...', { output });

    return output;
  }

  private async executeCommands({ page, initialInput }: { page: Page; initialInput?: TInput }): Promise<TOutput> {
    const commands = this.buildCommands({ logger: this.logger, page });
    let previousCommandOutput = initialInput;

    for (const nextCommand of commands) {
      const nextCommandInput = previousCommandOutput;

      this.logger.debug('Initializing workflow command execution...', {
        command: nextCommand.getId(),
        input: nextCommandInput,
      });

      previousCommandOutput = await nextCommand.execute(nextCommandInput);

      this.logger.debug('Finishing workflow command execution...', {
        command: nextCommand.getId(),
        output: previousCommandOutput,
      });
    }

    return previousCommandOutput as any as TOutput;
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
    page.setDefaultTimeout(5000);

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

  public getOrBuildCronCommand(): CronCommand {
    if (!this.cronCommand) {
      this.cronCommand = new CronCommand({
        command: async () => {
          await this.execute();
        },
        cronExpression: this.buildCronExpression(),
        logger: this.logger,
      });
    }

    return this.cronCommand;
  }

  public abstract buildCronExpression(): string;
}
