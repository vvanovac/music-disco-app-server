import { config } from 'dotenv';
config({ path: '.env.tests' });
import { createConnection } from 'typeorm';
import { database } from '../src/common/constants';

export default async function () {
  const testConnection = await createConnection(database);
  const truncateQueries = ['users', 'tasks']
    .map((table) => `${database.schema}.${table}`)
    .map((table) => `DROP TABLE IF EXISTS ${table}`)
    .map((query) => testConnection.query(query));
  await Promise.all(truncateQueries);
  await testConnection.close();
}
