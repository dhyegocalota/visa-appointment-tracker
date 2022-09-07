import WorkflowCommand from '@/workflow-command';
import { GetAvailableAppointmentConsulatesExecutionState } from '@/workflows/execution-states';

export default class SelectGroupWorkflowCommand extends WorkflowCommand<GetAvailableAppointmentConsulatesExecutionState> {
  static getId(): string {
    return 'select-group';
  }

  public shouldRetry(): boolean {
    return true;
  }

  async retryableExecute(): Promise<void> {
    const continueToActionsButtonElement = await this.page.waitForXPath(
      `//div[contains(concat(" ", normalize-space(@class), " "), " attend_appointment ")]//a[contains(@href, "/niv/schedule/${this.config.workflows.getAvailableAppointmentConsulates.visaGroupId}/continue_actions")]`,
      { visible: true }
    );

    await continueToActionsButtonElement!.click();
  }
}
