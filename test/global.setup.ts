import { config } from 'dotenv';
config({ path: '.env.tests' });
import { createConnection } from 'typeorm';
import { database } from '../src/common/constants';

export default async () => {
  const testConnection = await createConnection(database);
  await testConnection.query(`CREATE SCHEMA IF NOT EXISTS ${database.schema};`);
  await testConnection.close();
};
