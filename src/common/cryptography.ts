import * as crypto from 'crypto';
export interface IHashedPassword {
  hash: string;
  salt: string;
}
const passwordRegex = /^(?=.*?[a-z])(?=.*?[0-9]).{8,}$/;
const digest = 'sha256';
const salt: string = crypto.randomBytes(128).toString('base64');
const encoding: BufferEncoding = 'hex';
const LENGTH = 64;
export const comparePasswords = (
  input: string,
  match: string,
  salted: string,
): Promise<boolean> => {
  return new Promise<boolean>(
    (resolve: (data) => void, reject: (data) => void) => {
      crypto.pbkdf2(
        input,
        salted,
        10000,
        LENGTH,
        digest,
        (err: Error, hash: Buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve((hash.toString(encoding) === match) as boolean);
          }
        },
      );
    },
  );
};
export const hashPassword = (input: string): Promise<IHashedPassword> => {
  return new Promise<IHashedPassword>(
    (resolve: (data) => void, reject: (data) => void) => {
      crypto.pbkdf2(
        input,
        salt,
        10000,
        LENGTH,
        digest,
        (err?: Error, hash?: Buffer) => {
          if (err) {
            reject(err);
          } else {
            // return hexadecimal representation of hash
            resolve({ hash: hash.toString(encoding), salt });
          }
        },
      );
    },
  );
};
export const isValidPasswordFormat = (password: string): boolean => {
  const regex = new RegExp(passwordRegex);
  return !!password.match(regex);
};
