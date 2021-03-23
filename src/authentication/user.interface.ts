export interface IUser {
  readonly id?: number;
  readonly username: string;
  readonly password?: string;
  readonly hash?: string;
  readonly salt?: string;
  readonly email: string;
  readonly isAdmin?: boolean;
}

export interface ILogin {
  readonly accessToken: string;
}

export interface ILoginUser {
  readonly username: string;
  readonly password: string;
}

export interface IFindUserAdditionalOptions {
  readonly addID?: boolean;
  readonly addHashSalt?: boolean;
}
