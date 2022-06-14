import { Logger } from 'winston';
import Workflow from '@/workflow';
import { Config } from '@/types';
import buildConfigFromEnv from '@/build-config-from-env';
import buildDefaultLogger from '@/build-default-logger';

export default class WorkflowRegistry {
  private static instance: WorkflowRegistry;

  logger: Logger;

  config?: Config;

  public static getOrInitialize(): WorkflowRegistry {
    if (!this.instance) {
      this.instance = new WorkflowRegistry();
    }

    return this.instance;
  }

  private constructor() {
    this.logger = buildDefaultLogger();
  }

  getWorkflows(): Workflow[] {
    const workflows: { [workflowName: string]: new (...args: any[]) => Workflow } = require('@/workflows');
    const config = this.getOrBuildConfig();

    return Object.entries(workflows)
      .filter(([workflowName, WorkflowClass]) => {
        const isCallable = typeof WorkflowClass === 'function';

        if (!isCallable) {
          this.logger.debug(`Skipped workflow "${workflowName}" because it isn't callable`);
        }

        return isCallable;
      })
      .map(([_, WorkflowClass]) => {
        return new WorkflowClass({ config });
      });
  }

  private getOrBuildConfig(): Config {
    if (!this.config) {
      this.config = buildConfigFromEnv();
    }

    return this.config;
  }
}
