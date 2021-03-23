import { config } from 'dotenv';
config({ path: '.env.tests' });
import { createConnection } from 'typeorm';
import constants from '../src/common/constants';

export default async function () {
  const testConnection = await createConnection(constants.database);
  const truncateQueries = ['users', 'tasks']
    .map((table) => `${constants.database.schema}.${table}`)
    .map((table) => `DROP TABLE IF EXISTS ${table}`)
    .map((query) => testConnection.query(query));
  await Promise.all(truncateQueries);
  await testConnection.close();
}
