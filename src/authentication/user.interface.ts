export default interface IUser {
  readonly username: string;
  readonly password: string;
  readonly email: string;
  readonly isAdmin?: boolean;
}
