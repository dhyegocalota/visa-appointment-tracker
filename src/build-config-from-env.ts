import dotenv from 'dotenv';
import { Config, Env } from '@/types';

dotenv.config();

declare var process: {
  env: {
    NODE_ENV: string;
    VISA_CREDENTIALS_EMAIL: string;
    VISA_CREDENTIALS_PASSWORD: string;
    TWILIO_ACCOUNT_SID: string;
    TWILIO_AUTH_TOKEN: string;
    TWILIO_CALLER_NUMBER: string;
    TWILIO_RECEIVER_NUMBER: string;
    GET_CITIES_WORKFLOW_CRON_EXPRESSION: string;
  };
};

export default function buildConfigFromEnv(): Config {
  return {
    env: process.env.NODE_ENV === 'production' ? Env.PRODUCTION : Env.DEVELOPMENT,
    visaCredentialsEmail: process.env.VISA_CREDENTIALS_EMAIL,
    visaCredentialsPassword: process.env.VISA_CREDENTIALS_PASSWORD,
    twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
    twilioAuthToken: process.env.TWILIO_AUTH_TOKEN,
    twilioCallerNumber: process.env.TWILIO_CALLER_NUMBER,
    twilioReceiverNumber: process.env.TWILIO_RECEIVER_NUMBER,
    getCitiesWorkflowCronExpression: process.env.GET_CITIES_WORKFLOW_CRON_EXPRESSION,
  };
}
