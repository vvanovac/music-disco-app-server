import { config } from 'dotenv';
config({ path: '.env.tests' });
import { createConnection } from 'typeorm';
import constants from '../src/common/constants';

export default async () => {
  const testConnection = await createConnection(constants.database);
  await testConnection.query(
    `CREATE SCHEMA IF NOT EXISTS ${constants.database.schema};`,
  );
  await testConnection.close();
};
