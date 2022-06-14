import WorkflowCommand from '@/workflow-command';

export default class SelectGroupActionWorkflowCommand extends WorkflowCommand {
  getId(): string {
    return 'select-group';
  }

  async execute(): Promise<void> {
    const rescheduleInterviewAccordionButton = await this.page.waitForXPath(
      `//li[contains(concat(" ", normalize-space(@class), " "), " accordion-item ")]//a[contains(concat(" ", normalize-space(@class), " "), " accordion-title ") and contains(., "Reagendar entrevista")]`,
      { visible: true }
    );

    await rescheduleInterviewAccordionButton!.click({ delay: 1000 });

    const rescheduleInterviewButton = await this.page.waitForXPath(
      `//li[contains(concat(" ", normalize-space(@class), " "), " accordion-item ")]//a[contains(concat(" ", normalize-space(@class), " "), " button ") and contains(., "Reagendar entrevista")]`,
      { visible: true }
    );

    await rescheduleInterviewButton!.click();
  }
}
