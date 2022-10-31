import WorkflowCommand from '@/workflow-command';
import { GetAvailableAppointmentConsulatesExecutionState } from '@/workflows/execution-states';

export default class SignInWorkflowCommand extends WorkflowCommand<GetAvailableAppointmentConsulatesExecutionState> {
  static getId(): string {
    return 'sign-in';
  }

  public shouldRetry(): boolean {
    return true;
  }

  async retryableExecute(): Promise<void> {
    const { visaSystemLocation } = this.config.workflows.getAvailableAppointmentConsulates;
    await this.page.goto(`https://ais.usvisa-info.com/${visaSystemLocation}/niv/users/sign_in`, {
      waitUntil: 'networkidle0',
    });

    const emailInputElement = await this.page.waitForSelector('#user_email');
    const { visaCredentialsEmail, visaCredentialsPassword } = this.config.workflows.getAvailableAppointmentConsulates;

    await emailInputElement!.click();
    await this.page.keyboard.type(visaCredentialsEmail, { delay: 50 });

    const passwordInputElement = await this.page.waitForSelector('#user_password');

    await passwordInputElement!.click();
    await this.page.keyboard.type(visaCredentialsPassword, { delay: 50 });

    const policyAgreementInputElement = await this.page.waitForSelector('#policy_confirmed');
    await policyAgreementInputElement!.click();

    await this.page.keyboard.press('Enter');
  }
}
