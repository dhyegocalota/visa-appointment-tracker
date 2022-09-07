#!/usr/bin/env node

import buildConfigFromEnv from '@/build-config-from-env';
import buildDefaultLogger from '@/build-default-logger';
import WorkflowRegistry from '@/workflow-registry';

const config = buildConfigFromEnv();
const logger = buildDefaultLogger();
const workflows = WorkflowRegistry.getOrInitialize().buildWorkflows({ config, logger });

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
