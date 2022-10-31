#!/usr/bin/env node

import buildConfigFromEnv from '@/build-config-from-env';
import buildDefaultLogger from '@/build-default-logger';
import WorkflowRegistry from '@/workflow-registry';
import { Env } from '@/types/env';

const config = buildConfigFromEnv();
const logger = buildDefaultLogger();
const workflows = WorkflowRegistry.getOrInitialize().buildWorkflows({ config, logger });

if (config.env === Env.DEVELOPMENT) {
  workflows.forEach((workflow) => {
    workflow.execute();
  });
}

if (config.env === Env.PRODUCTION) {
  workflows.forEach((workflow) => {
    const cron = workflow.getOrBuildCronExecution();
    cron.start();
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received');
    workflows.forEach((workflow) => {
      const cron = workflow.getOrBuildCronExecution();
      cron.stop();
    });
  });
}
