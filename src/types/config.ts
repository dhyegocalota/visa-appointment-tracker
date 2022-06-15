import { Env } from '@/types/env';

export type Config = {
  env: Env;
  visaCredentialsEmail: string;
  visaCredentialsPassword: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioCallerNumber: string;
  twilioReceiverNumber: string;
  getCitiesWorkflowCronExpression: string;
};
