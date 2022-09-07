import puppeteer from 'puppeteer';
import * as dateFns from 'date-fns';
import WorkflowCommand from '@/workflow-command';
import { AppointmentConsulate } from '@/types';
import { GetAvailableAppointmentConsulatesExecutionState } from '@/workflows/execution-states';

export default class BuildAppointmentConsulatesWorkflowCommand extends WorkflowCommand<GetAvailableAppointmentConsulatesExecutionState> {
  static getId(): string {
    return 'build-appointment-consulates';
  }

  public shouldRetry(): boolean {
    return true;
  }

  async retryableExecute(): Promise<void> {
    const availableConsulatesInput = await this.page.waitForSelector('#appointments_consulate_appointment_facility_id');
    await availableConsulatesInput!.select();

    const availableConsulates = await availableConsulatesInput!.evaluate((select) =>
      Object.fromEntries(
        Array.from((<HTMLSelectElement>select).options)
          .map((option) => [option.value, option.textContent])
          .filter(([cityId]) => Boolean(cityId))
      )
    );

    const appointmentConsulates: AppointmentConsulate[] = [];
    const { visaGroupId } = this.config.workflows.getAvailableAppointmentConsulates;

    for (const cityId in availableConsulates) {
      const cityName = <string>availableConsulates[cityId];
      const consulateLogger = this.logger.child({ cityId, cityName });
      await availableConsulatesInput!.select(cityId);

      let consulateAvailableDatesResponse!: puppeteer.HTTPResponse;

      await this.page.waitForResponse(async (response) => {
        const responseUrl = response.url();
        const doesResponseMatchAvailableDatesEndpoint = Boolean(
          responseUrl.match(new RegExp(`/niv/schedule/${visaGroupId}/appointment/days/${cityId}.json`))
        );

        if (doesResponseMatchAvailableDatesEndpoint) {
          consulateAvailableDatesResponse = response;
        }

        return doesResponseMatchAvailableDatesEndpoint;
      });

      const didConsulateAvailableDatesResponseSucceeded = [200, 304].includes(consulateAvailableDatesResponse.status());

      if (!didConsulateAvailableDatesResponseSucceeded) {
        consulateLogger.debug('Consulate available dates request has failed', {
          response: consulateAvailableDatesResponse,
        });

        appointmentConsulates.push({ cityId, cityName, availableDates: [] });
        continue;
      }

      const availableAppointments: Array<{ date: string; business_day: boolean }> =
        await consulateAvailableDatesResponse.json();

      const availableDates = availableAppointments.map((availableAppointment) => {
        return dateFns.parse(availableAppointment.date, 'yyyy-MM-dd', new Date());
      });

      if (!availableDates.length) {
        consulateLogger.debug('Consulate available dates list is empty. Did you get soft-banned?', {
          response: consulateAvailableDatesResponse,
        });
      }

      appointmentConsulates.push({ cityId, cityName, availableDates });
    }

    this.executionState.setAppointmentConsulates(appointmentConsulates);
  }
}
