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
    await this.page.goto(`https://ais.usvisa-info.com/pt-br/niv/users/sign_in`, {
      waitUntil: 'networkidle0',
    });

    const emailInputElement = await this.page.waitForSelector('#user_email');
    const { visaCredentialsEmail, visaCredentialsPassword } = this.config.workflows.getAvailableAppointmentConsulates;

    await emailInputElement!.click();
    await this.page.keyboard.type(visaCredentialsEmail, { delay: 25 });

    const passwordInputElement = await this.page.waitForSelector('#user_password');

    await passwordInputElement!.click();
    await this.page.keyboard.type(visaCredentialsPassword, { delay: 25 });

    const policyAgreementInputElement = await this.page.waitForSelector('#policy_confirmed');
    await policyAgreementInputElement!.click();

    await this.page.keyboard.press('Enter');
  }
}
