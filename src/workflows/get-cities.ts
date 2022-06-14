import { Logger } from 'winston';
import { Page } from 'puppeteer';
import Workflow from '@/workflow';
import {
  BuildAppointmentCitiesWorkflowCommand,
  NotifyIfThereIsAnyAvailableDateWorkflowCommand,
  SelectAppointmentMembersWorkflowCommand,
  SelectGroupActionWorkflowCommand,
  SelectGroupWorkflowCommand,
  SignInWorkflowCommand,
} from '@/workflows/commands';

export default class GetCitiesWorkflow extends Workflow {
  buildCommands({ logger, page }: { logger: Logger; page: Page }) {
    return [
      new SignInWorkflowCommand({ logger, config: this.config, page }),
      new SelectGroupWorkflowCommand({ logger, config: this.config, page }),
      new SelectGroupActionWorkflowCommand({ logger, config: this.config, page }),
      new SelectAppointmentMembersWorkflowCommand({ logger, config: this.config, page }),
      new BuildAppointmentCitiesWorkflowCommand({ logger, config: this.config, page }),
      new NotifyIfThereIsAnyAvailableDateWorkflowCommand({ logger, config: this.config, page }),
    ];
  }

  public buildCronExpression(): string {
    return '* * * * *';
  }
}
