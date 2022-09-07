import { AppointmentConsulate } from '@/types';
import WorkflowExecutionState from '@/workflow-execution-state';

export default class GetAvailableAppointmentConsulatesExecutionState extends WorkflowExecutionState {
  private appointmentConsulates?: AppointmentConsulate[];

  setAppointmentConsulates(appointmentConsulates: AppointmentConsulate[]): void {
    this.throwIfHasNotInitialized();
    this.appointmentConsulates = appointmentConsulates;
  }

  getAppointmentConsulatesOrThrow(): AppointmentConsulate[] {
    this.throwIfHasNotInitialized();

    if (!this.appointmentConsulates) {
      throw new Error('Appointment Consulates are undefined');
    }

    return this.appointmentConsulates;
  }
}
