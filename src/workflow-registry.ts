import { Logger } from 'winston';
import Workflow from '@/workflow';
import { Config, ConstructorOf } from '@/types';

export default class WorkflowRegistry {
  private static instance: WorkflowRegistry;

  private workflowClasses: Map<String, ConstructorOf<Workflow>> = new Map();

  public static getOrInitialize(): WorkflowRegistry {
    if (!this.instance) {
      this.instance = new WorkflowRegistry();
    }

    return this.instance;
  }

  private constructor() {}

  registerWorkflowClass(WorkflowClass: ConstructorOf<Workflow>): WorkflowRegistry {
    this.workflowClasses.set(this.getIdOfWorkflowClass(WorkflowClass), WorkflowClass);
    return this;
  }

  private getIdOfWorkflowClass(WorkflowClass: ConstructorOf<Workflow>): string {
    return (WorkflowClass as any as typeof Workflow).getId();
  }

  unregisterWorkflowClass(WorkflowClass: ConstructorOf<Workflow>): WorkflowRegistry {
    this.workflowClasses.delete(this.getIdOfWorkflowClass(WorkflowClass));
    return this;
  }

  resetWorkflowClasses(): WorkflowRegistry {
    this.workflowClasses.clear();
    return this;
  }

  buildWorkflows({ config, logger }: { config: Config; logger: Logger }): Workflow[] {
    this.loadWorkflowClasses();

    return Array.from(this.workflowClasses).map(([_, WorkflowClass]) => {
      return new WorkflowClass({ config, logger });
    });
  }

  private loadWorkflowClasses(): void {
    // We load all exports from the workflows folder
    // in runtime so they can register themselves
    require('@/workflows');
  }
}
