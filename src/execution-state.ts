import { TransformableInfo } from 'logform';

export default class ExecutionState {
  protected executionId: String;

  private _hasInitialized: boolean = false;

  constructor({ executionId }: { executionId: String }) {
    this.executionId = executionId;
  }

  public hasInitialized(): boolean {
    return this._hasInitialized;
  }

  public init(): ExecutionState {
    this.throwIfHasInitialized();
    this._hasInitialized = true;
    return this;
  }

  public throwIfHasInitialized(): void {
    if (this._hasInitialized) {
      throw new Error('Workflow has already been initialized');
    }
  }

  public finish(): ExecutionState {
    this.throwIfHasNotInitialized();
    this._hasInitialized = false;
    return this;
  }

  public throwIfHasNotInitialized(): void {
    if (!this._hasInitialized) {
      throw new Error('Workflow has not been initialized yet');
    }
  }

  public buildLoggerLabel(_: TransformableInfo): String | undefined {
    if (this._hasInitialized) {
      return `[${this.executionId}]`;
    }
  }
}
