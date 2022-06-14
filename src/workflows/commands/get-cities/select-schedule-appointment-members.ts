import WorkflowCommand from '@/workflow-command';

export default class SelectAppointmentMembersWorkflowCommand extends WorkflowCommand {
  getId(): string {
    return 'select-appointment-members';
  }

  async execute(): Promise<void> {
    const continueToRescheduleButtonElement = await this.page.waitForXPath(
      `//input[@type="submit" and @value="Continuar"]`,
      {
        visible: true,
      }
    );

    await continueToRescheduleButtonElement!.click({ delay: 1000 });
  }
}
