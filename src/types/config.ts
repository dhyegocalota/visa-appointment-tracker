import { Env } from '@/types/env';

export type Config = {
  env: Env;
  isVerbose: boolean;
  defaultPuppeteerTimeout: number;
  workflows: {
    getAvailableAppointmentConsulates: {
      cronExpression: string;
      visaCredentialsEmail: string;
      visaCredentialsPassword: string;
      visaGroupId: string;
      visaMinAppointmentDate: string;
      visaMaxAppointmentDate: string;
      visaNotificationMessage: string;
      visaNotificationMessageLang: string;
      twilioAccountSid: string;
      twilioAuthToken: string;
      twilioCallerNumber: string;
      twilioReceiverNumber: string;
    };
  };
};
