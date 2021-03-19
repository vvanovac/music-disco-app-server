export default interface IUser {
  readonly id?: number;
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly isAdmin?: boolean;
}
