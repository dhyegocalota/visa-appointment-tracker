import { Logger } from 'winston';
import { Page } from 'puppeteer';
import * as dateFns from 'date-fns';
import { Config, DeepPartial } from '@/types';
import Workflow from '@/workflow';
import RegisterWorkflow from '@/register-workflow';
import {
  BuildAppointmentConsulatesWorkflowCommand,
  NotifyAvailableDatesWorkflowCommand,
  NavigateToGroupAppointmentWorkflowCommand,
  SignInWorkflowCommand,
} from '@/workflows/commands';
import { GetAvailableAppointmentConsulatesExecutionState } from '@/workflows/execution-states';

@RegisterWorkflow
export default class GetAvailableAppointmentConsulatesWorkflow extends Workflow<GetAvailableAppointmentConsulatesExecutionState> {
  static getId(): string {
    return 'get-available-appointment-consulates';
  }

  buildDefaultConfig(): DeepPartial<Config> {
    return {
      workflows: {
        getAvailableAppointmentConsulates: {
          cronExpression: '*/15 * * * *',
          visaMinAppointmentDate: dateFns.format(dateFns.startOfMonth(new Date()), 'yyyy-MM-dd'),
          visaMaxAppointmentDate: dateFns.format(dateFns.endOfMonth(new Date()), 'yyyy-MM-dd'),
          visaNotificationMessage:
            'This is Visa Appointment Bot. I found <%= it.totalOfAvailableDates %> available dates. Hurry to reschedule your appointment.',
          visaNotificationMessageLang: 'en-US',
        },
      },
    };
  }

  buildExecutionState(): GetAvailableAppointmentConsulatesExecutionState {
    return new GetAvailableAppointmentConsulatesExecutionState({
      executionId: this.getId(),
    });
  }

  buildCommands({
    logger,
    page,
    executionState,
  }: {
    logger: Logger;
    page: Page;
    executionState: GetAvailableAppointmentConsulatesExecutionState;
  }) {
    return [
      new SignInWorkflowCommand({ logger, config: this.config, page, executionState }),
      new NavigateToGroupAppointmentWorkflowCommand({ logger, config: this.config, page, executionState }),
      new BuildAppointmentConsulatesWorkflowCommand({ logger, config: this.config, page, executionState }),
      new NotifyAvailableDatesWorkflowCommand({ logger, config: this.config, page, executionState }),
    ];
  }

  public buildCronExpression(): string {
    return this.config.workflows.getAvailableAppointmentConsulates.cronExpression;
  }
}
