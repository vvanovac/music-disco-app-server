export default interface ITask {
  readonly id?: number;
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
  imageURL?: string;
}
