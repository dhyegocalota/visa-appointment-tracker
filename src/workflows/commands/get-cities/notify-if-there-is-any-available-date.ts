import buildTwilioClient from 'twilio';
import WorkflowCommand from '@/workflow-command';
import { AppointmentCity } from '@/types';

export default class NotifyIfThereIsAnyAvailableDateWorkflowCommand extends WorkflowCommand<AppointmentCity[]> {
  getId(): string {
    return 'notify-if-there-is-any-available-date';
  }

  async execute(appointmentCities: AppointmentCity[]): Promise<void> {
    if (!appointmentCities) {
      throw new Error('Cities were not crawled');
    }

    const citiesWithSomeAvailableDate = appointmentCities.filter(({ availableDates }) => {
      return availableDates.length > 0;
    });

    const totalOfAvailableDates = citiesWithSomeAvailableDate.reduce(
      (partialTotalOfAvailableDates, { availableDates }) => {
        return partialTotalOfAvailableDates + availableDates.length;
      },
      0
    );

    if (totalOfAvailableDates > 0) {
      await this.notifyTotalOfAvailableDates(totalOfAvailableDates);
    }
  }

  private async notifyTotalOfAvailableDates(totalOfAvailableDates: number): Promise<void> {
    const message = `Aqui é o robô notificador. Encontrei ${totalOfAvailableDates} datas disponíveis para reagendar o Visa.`;
    const twilioClient = buildTwilioClient(this.config.twilioAccountSid, this.config.twilioAuthToken);
    const twiml = new buildTwilioClient.twiml.VoiceResponse();
    twiml.say(
      {
        language: 'pt-BR',
        loop: 5,
      },
      message
    );

    await twilioClient.calls.create({
      twiml: twiml.toString(),
      from: this.config.twilioCallerNumber,
      to: this.config.twilioReceiverNumber,
    });
  }
}
