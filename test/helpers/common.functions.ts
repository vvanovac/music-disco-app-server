import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';

import { AppModule } from '../../src/app.module';
import * as SeedData from './seed.data';

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
  await repository.query(`TRUNCATE ${repository.metadata.tablePath} RESTART IDENTITY;`);
  await app.close();
};

export const GenerateSeed = async (elementToInsert: string[]) => elementToInsert;
