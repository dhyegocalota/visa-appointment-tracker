import WorkflowCommand from '@/workflow-command';
import { GetAvailableAppointmentConsulatesExecutionState } from '@/workflows/execution-states';

export default class SelectAppointmentMembersWorkflowCommand extends WorkflowCommand<GetAvailableAppointmentConsulatesExecutionState> {
  static getId(): string {
    return 'select-appointment-members';
  }

  public shouldRetry(): boolean {
    return true;
  }

  async retryableExecute(): Promise<void> {
    const continueToRescheduleButtonElement = await this.page.waitForXPath(
      `//input[@type="submit" and @value="Continuar"]`,
      {
        visible: true,
      }
    );

    await continueToRescheduleButtonElement!.click({ delay: 1000 });
  }
}
