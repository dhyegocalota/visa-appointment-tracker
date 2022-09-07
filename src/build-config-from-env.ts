import dotenv from 'dotenv';
import { Config, Env } from '@/types';

dotenv.config();

declare var process: {
  env: {
    NODE_ENV?: string;
    VERBOSE?: string;
    DEFAULT_PUPPETEER_TIMEOUT?: string;
    GET_AVAILABLE_APPOINTMENT_CONSULATES_WORKFLOW_CONFIG_IN_JSON?: string;
  };
};

export default function buildConfigFromEnv(): Config {
  return {
    env: buildConfigEnvFromEnv(),
    isVerbose: buildConfigIsVerboseFromEnv(),
    defaultPuppeteerTimeout: buildConfigDefaultPuppeteerTimeoutFromEnv(),
    workflows: {
      getAvailableAppointmentConsulates: buildConfigOfGetAvailableAppointmentConsulatesWorkflowFromEnv(),
    },
  };
}

export function buildConfigEnvFromEnv(): Env {
  return process.env.NODE_ENV === 'production' ? Env.PRODUCTION : Env.DEVELOPMENT;
}

export function buildConfigIsVerboseFromEnv(): boolean {
  if (process.env.VERBOSE) {
    return Boolean(JSON.parse(process.env.VERBOSE.toLowerCase()));
  }

  return false;
}

export function buildConfigDefaultPuppeteerTimeoutFromEnv(): number {
  if (process.env.DEFAULT_PUPPETEER_TIMEOUT) {
    return parseInt(process.env.DEFAULT_PUPPETEER_TIMEOUT);
  }

  return 5000;
}

export function buildConfigOfGetAvailableAppointmentConsulatesWorkflowFromEnv(): any {
  if (process.env.GET_AVAILABLE_APPOINTMENT_CONSULATES_WORKFLOW_CONFIG_IN_JSON) {
    return JSON.parse(process.env.GET_AVAILABLE_APPOINTMENT_CONSULATES_WORKFLOW_CONFIG_IN_JSON);
  }
}
