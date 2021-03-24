import { Test, TestingModule } from '@nestjs/testing';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from '../src/app.module';

export const StartServer = async (repositoryUsed, dataToInject) => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  app.useGlobalPipes(new ValidationPipe());
  await app.init();
  const repository = moduleFixture.get(repositoryUsed);
  await repository.save(dataToInject);
  return { app, repository };
};

export const StopServer = async (app, repository) => {
  await repository.query(`TRUNCATE ${repository.metadata.tablePath} RESTART IDENTITY;`);
  await app.close();
};
