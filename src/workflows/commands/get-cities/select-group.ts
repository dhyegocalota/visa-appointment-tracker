import WorkflowCommand from '@/workflow-command';

export default class SelectGroupWorkflowCommand extends WorkflowCommand {
  getId(): string {
    return 'select-group';
  }

  async execute(): Promise<void> {
    const continueToActionsButtonElement = await this.page.waitForXPath(
      `//div[contains(concat(" ", normalize-space(@class), " "), " attend_appointment ")]//a[contains(., "Continuar")]`,
      { visible: true }
    );

    await continueToActionsButtonElement!.click();
  }
}
