import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '../../src/app.module';
import { createConnection } from 'typeorm';
import { database, jwt } from '../../src/common/constants';
import * as SeedData from './seed.data';
import { JwtService } from '@nestjs/jwt';

export const StartServer = async (repositoryUsed: string) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  const repository = moduleFixture.get(repositoryUsed.concat('Repository'));
  await repository.save(SeedData[repositoryUsed.toLowerCase()]());
  return { app, repository };
};

export const StopServer = async (app: INestApplication, repository) => {
  await repository.query(`TRUNCATE ${repository.metadata.tablePath} RESTART IDENTITY CASCADE;`);
  await app.close();
};

export const GenerateSeed = async (elementsToInsert: string[]) => {
  const testConnection = await createConnection(database);
  const promises = elementsToInsert.map((table) => {
    const repositoryName = table;
    const repositoryData = SeedData[table.toLowerCase()];
    if (!repositoryData) {
      return;
    }
    const repository = testConnection.getRepository(repositoryName);
    return repository.save(repositoryData());
  });
  await Promise.all(promises);
  await testConnection.close();
};

export const RemoveSeed = async (tablesToRemove: string[]) => {
  const testConnection = await createConnection(database);
  const truncateQueries = tablesToRemove
    .map((table) => `${database.schema}.${table}`)
    .map((table) => `TRUNCATE ${table} RESTART IDENTITY;`)
    .map((query) => testConnection.query(query));
  await Promise.all(truncateQueries);
  await testConnection.close();
};

export const GenerateToken = (isAdmin: boolean) => {
  const [nonAdminUser, adminUser] = SeedData.users(false);
  const user = isAdmin ? adminUser : nonAdminUser;
  return new JwtService({ secret: jwt.secret, signOptions: { expiresIn: jwt.expiresIn } }).sign(user);
};
