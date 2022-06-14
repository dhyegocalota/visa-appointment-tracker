import WorkflowCommand from '@/workflow-command';

export default class SignInWorkflowCommand extends WorkflowCommand {
  getId(): string {
    return 'sign-in';
  }

  async execute(): Promise<void> {
    await this.page.goto('https://ais.usvisa-info.com/pt-br/niv/users/sign_in', {
      waitUntil: 'networkidle0',
    });

    const emailInputElement = await this.page.waitForSelector('#user_email');

    await emailInputElement!.click();
    await this.page.keyboard.type(this.config.visaCredentialsEmail, { delay: 25 });

    const passwordInputElement = await this.page.waitForSelector('#user_password');

    await passwordInputElement!.click();
    await this.page.keyboard.type(this.config.visaCredentialsPassword, { delay: 25 });

    const policyAgreementInputElement = await this.page.waitForSelector('#policy_confirmed');
    await policyAgreementInputElement!.click();

    this.page.keyboard.press('Enter');
  }
}
