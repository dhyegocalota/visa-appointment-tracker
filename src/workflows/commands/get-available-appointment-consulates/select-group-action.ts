import WorkflowCommand from '@/workflow-command';
import { GetAvailableAppointmentConsulatesExecutionState } from '@/workflows/execution-states';

export default class SelectGroupActionWorkflowCommand extends WorkflowCommand<GetAvailableAppointmentConsulatesExecutionState> {
  static getId(): string {
    return 'select-group';
  }

  public shouldRetry(): boolean {
    return true;
  }

  async retryableExecute(): Promise<void> {
    const rescheduleInterviewAccordionButton = await this.page.waitForXPath(
      `//a[contains(concat(" ", normalize-space(@class), " "), " accordion-title ")]//span[contains(concat(" ", normalize-space(@class), " "), " fa-calendar-minus ")]/ancestor::a`,
      { visible: true }
    );

    await rescheduleInterviewAccordionButton!.click({ delay: 1000 });

    const rescheduleInterviewButton = await this.page.waitForXPath(
      `//div[contains(concat(" ", normalize-space(@class), " "), " accordion-content ")]//span[contains(concat(" ", normalize-space(@class), " "), " fa-calendar-minus ")]/ancestor::div[contains(concat(" ", normalize-space(@class), " "), " accordion-content ")]//a[contains(@href, "/niv/schedule/${this.config.workflows.getAvailableAppointmentConsulates.visaGroupId}/appointment")]`,
      { visible: true }
    );

    await rescheduleInterviewButton!.click();
  }
}
