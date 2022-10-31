import WorkflowCommand from '@/workflow-command';
import { GetAvailableAppointmentConsulatesExecutionState } from '@/workflows/execution-states';

export default class NavigateToGroupAppointmentWorkflowCommand extends WorkflowCommand<GetAvailableAppointmentConsulatesExecutionState> {
  static getId(): string {
    return 'navigate-to-group-appointment';
  }

  public shouldRetry(): boolean {
    return true;
  }

  async retryableExecute(): Promise<void> {
    const { visaGroupId } = this.config.workflows.getAvailableAppointmentConsulates;
    await this.page.goto(`https://ais.usvisa-info.com/pt-br/niv/schedule/${visaGroupId}/appointment`, {
      waitUntil: 'networkidle0',
    });
  }
}
