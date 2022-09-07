export default interface Execution<TExecutionOutput> {
  execute(): Promise<TExecutionOutput>;
}
