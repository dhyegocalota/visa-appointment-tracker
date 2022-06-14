#!/usr/bin/env node

import buildDefaultLogger from '@/build-default-logger';
import WorkflowRegistry from '@/workflow-registry';

const logger = buildDefaultLogger();
const workflows = WorkflowRegistry.getOrInitialize().getWorkflows();

workflows.forEach((workflow) => {
  const cron = workflow.getOrBuildCronCommand();
  cron.start();
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received');
  workflows.forEach((workflow) => {
    const cron = workflow.getOrBuildCronCommand();
    cron.stop();
  });
});
