import puppeteer from 'puppeteer';
import WorkflowCommand from '@/workflow-command';
import { AppointmentCity } from '@/types';

export default class BuildAppointmentCitiesWorkflowCommand extends WorkflowCommand<void, AppointmentCity[]> {
  getId(): string {
    return 'build-appointment-cities';
  }

  async execute(): Promise<AppointmentCity[]> {
    const availableCitiesLabel = await this.page.waitForXPath(
      '//label[@for="appointments_consulate_appointment_facility_id"]'
    );

    const availableCitiesInput = await this.page.waitForSelector('#appointments_consulate_appointment_facility_id');
    await availableCitiesInput!.select();

    const availableCities = await availableCitiesInput!.evaluate((select) =>
      Object.fromEntries(
        Array.from((<HTMLSelectElement>select).options)
          .map((option) => [option.value, option.textContent])
          .filter(([cityId]) => Boolean(cityId))
      )
    );

    const appointmentCities: AppointmentCity[] = [];

    for (const cityId in availableCities) {
      const cityName = <string>availableCities[cityId];
      await availableCitiesInput!.select(cityId);

      try {
        const appointmentDateInput = await this.page.waitForSelector('#appointments_consulate_appointment_date', {
          visible: true,
        });

        await appointmentDateInput!.click({ delay: 1000 });
      } catch (error) {
        const isTimeoutError = error instanceof puppeteer.errors.TimeoutError;

        if (!isTimeoutError) {
          this.logger.error('Could not get available dates of calendar', { cityId, cityName, error });
          throw error;
        }

        const noTimeAvailableMessage = await this.page.waitForSelector('#consulate_date_time_not_available', {
          visible: true,
        });

        if (noTimeAvailableMessage) {
          appointmentCities.push({ cityId, cityName, availableDates: [] });
          await availableCitiesLabel!.click();
          continue;
        }
      }

      await this.page.waitForResponse((response) => {
        const responseUrl = response.url();
        const doesResponseUrlMatchAvailableDatesEndpoint = Boolean(
          responseUrl.match(
            new RegExp(`^https://ais.usvisa-info.com/pt-br/niv/schedule/([\\w]+)/appointment/days/([\\w]+).json`)
          )
        );

        this.logger.debug(
          `Response URL ${
            doesResponseUrlMatchAvailableDatesEndpoint ? 'matches' : 'does not match'
          } the available dates endpoint: "${responseUrl}"`,
          { cityId, cityName, responseUrl }
        );

        return doesResponseUrlMatchAvailableDatesEndpoint;
      });

      await this.page.waitForSelector('#ui-datepicker-div', { visible: true });

      const availableDateButtons = await this.page.$$('#ui-datepicker-div td:not(.ui-datepicker-unselectable)');
      const availableDates = Array.from(availableDateButtons || []).map((button) => {
        const htmlButton = button as any as HTMLElement;
        const { month, year } = htmlButton.dataset;
        const day = htmlButton.textContent;

        if (!year || !month || !day) {
          throw new Error(`Invalid date of city: ${cityName}`);
        }

        const monthIndex = Number(month) - 1;
        return new Date(Number(year), monthIndex, Number(day));
      });

      appointmentCities.push({ cityId, cityName, availableDates });
      await availableCitiesLabel!.click();
    }

    return appointmentCities;
  }
}
