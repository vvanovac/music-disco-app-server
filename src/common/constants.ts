import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import Users from '../authentication/users.entity';
import Tasks from '../tasks/tasks.entity';

const pgSchema = process.env.DB_SCHEMA || 'public';

export enum AUTH_GUARD_TYPES_ENUM {
  ADMIN,
  AUTHORIZED,
}

export enum OCTAVE_ENUM {
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
}

export enum MUSIC_NOTES_ENUM {
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  A = 'A',
  B = 'B',
  C2 = 'C',
  Csharp = 'C#',
  Dsharp = 'D#',
  Fsharp = 'F#',
  Gsharp = 'G#',
  Asharp = 'A#',
}

export const port = +process.env.PORT || 3000;
export const database: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  schema: pgSchema,
  entities: [Users, Tasks],
  synchronize: true,
};
export const jwt = {
  secret: process.env.JWT_SECRET || 'strongSecretKey',
  expiresIn: process.env.JWT_EXPIRES_IN || '60h',
};
