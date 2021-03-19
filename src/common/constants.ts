import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const pgSchema = process.env.DB_SCHEMA || 'public';

export default {
  port: +process.env.PORT || 3000,
  database: {
    type: process.env.DB_TYPE || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    dbname: process.env.DB_NAME || 'postgres',
    schema: pgSchema,
  } as TypeOrmModuleOptions,
};
