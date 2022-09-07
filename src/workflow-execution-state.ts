import { TransformableInfo } from 'logform';
import ExecutionState from '@/execution-state';

export default class WorkflowExecutionState extends ExecutionState {
  private commandsExecution: ExecutionState;

  private totalOfCommands: number = 0;

  private currentCommand?: number;

  constructor({ executionId }: { executionId: String }) {
    super({ executionId });

    this.commandsExecution = new ExecutionState({ executionId });
  }

  public setTotalOfCommands(totalOfCommands: number): ExecutionState {
    this.commandsExecution.throwIfHasInitialized();
    this.totalOfCommands = totalOfCommands;
    return this;
  }

  public nextCommand(): ExecutionState {
    this.commandsExecution.throwIfHasNotInitialized();
    const nextCommand = typeof this.currentCommand === 'number' ? this.currentCommand + 1 : 1;
    const doesNextCommandExist = nextCommand <= this.totalOfCommands;

    if (!doesNextCommandExist) {
      throw new Error('Workflow has already reached the last command');
    }

    this.currentCommand = nextCommand;
    return this;
  }

  public finish(): ExecutionState {
    super.finish();
    this.currentCommand = undefined;
    return this;
  }

  public initCommands(): void {
    this.throwIfHasNotInitialized();
    this.commandsExecution.init();
  }

  public finishCommands(): void {
    this.throwIfHasNotInitialized();
    this.commandsExecution.finish();
  }

  public buildLoggerLabel(logInfo: TransformableInfo): String | undefined {
    const label = super.buildLoggerLabel(logInfo);
    const shouldLogProgressOfCommands = this.commandsExecution.hasInitialized();

    if (shouldLogProgressOfCommands) {
      return `${label} [${this.currentCommand}/${this.totalOfCommands}]`;
    }

    return label;
  }
}
