import WorkflowRegistry from '@/workflow-registry';
import Workflow from '@/workflow';
import { ConstructorOf } from '@/types';

export default function RegisterWorkflow(workflowClass: ConstructorOf<Workflow>): void {
  const registry = WorkflowRegistry.getOrInitialize();
  registry.registerWorkflowClass(workflowClass);
}
