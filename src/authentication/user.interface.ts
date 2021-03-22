export default interface IUser {
  readonly id?: number;
  readonly username: string;
  readonly hash: string;
  readonly salt: string;
  readonly email: string;
  readonly isAdmin?: boolean;
}
