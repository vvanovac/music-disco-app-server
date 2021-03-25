import { INestApplication, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import Tasks from '../../src/tasks/tasks.entity';
import ITask from '../../src/tasks/task.interface';
import { GenerateSeed, GenerateToken, RemoveSeed, StartServer, StopServer } from '../helpers/common.functions';
import { tasks } from '../helpers/seed.data';

const dataToCompare = (expected, received) => {
  expect(expected.title).toStrictEqual(received.title);
  expect(expected.subtitle).toStrictEqual(received.subtitle);
  expect(expected.description).toStrictEqual(received.description);
  expect(expected.imageURL).toStrictEqual(received.imageURL);
};

const GenerateHeader = (generateAuthorization = false, isAdmin = false) => {
  const header: any = {};
  if (generateAuthorization) {
    header.Authorization = `Bearer ${GenerateToken(isAdmin)}`;
  }
  return header;
};

describe('Tasks Module', () => {
  let app: INestApplication;
  let repository: Repository<Tasks>;

  beforeEach(async () => {
    const startTasksData = await StartServer('Tasks');
    app = startTasksData.app;
    repository = startTasksData.repository;
  });

  afterEach(async () => StopServer(app, repository));

  beforeAll(async () => GenerateSeed(['Users']));

  afterAll(() => RemoveSeed(['Users']));

  describe('While testing creating task flows', () => {
    it('should fail creating task with missing title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({ subtitle: 'task 1', description: 'task 1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with invalid type of title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({ title: 1, subtitle: 'task 1', description: 'task 1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with missing subtitle', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({ title: 'task 1', description: 'task 1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['subtitle must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with invalid type of subtitle', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({ title: 'task 1', subtitle: 1, description: 'task 1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['subtitle must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with missing description', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({ title: 'task 1', subtitle: 'task 1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with invalid type of description', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({ title: 'task 1', subtitle: 'task 1', description: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with invalid type of imageURL', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 'task 1',
          imageURL: 'imageURL',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['imageURL must be an URL address'],
          error: 'Bad Request',
        });
    });

    it('should successfully create task with mandatory fields', async () => {
      const create: ITask = {
        title: 'task 1',
        subtitle: 'task 1',
        description: 'task 1',
      };
      const { body } = await request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send(create)
        .expect(HttpStatus.CREATED);
      create.imageURL = null;
      const task = await repository.findOne(body.id);
      dataToCompare(create, task);
      dataToCompare(body, create);
    });

    it('should successfully create task with mandatory and optional fields', async () => {
      const create = {
        title: 'task 1',
        subtitle: 'task 1',
        description: 'task 1',
        imageURL: 'image-url.test',
      };
      const { body } = await request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send(create)
        .expect(HttpStatus.CREATED);

      const task = await repository.findOne(body.id);
      dataToCompare(create, task);
      dataToCompare(body, create);
    });

    it('should successfully create task with mandatory and optional fields', async () => {
      const create = {
        title: 'task 1',
        subtitle: 'task 1',
        description: 'task 1',
        imageURL: null,
      };
      const { body } = await request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send(create)
        .expect(HttpStatus.CREATED);

      const task = await repository.findOne(body.id);
      dataToCompare(create, task);
      dataToCompare(body, create);
    });
  });

  describe('While testing reading task flows', () => {
    it('should fail getting one task with not existing id', () => {
      return request(app.getHttpServer())
        .get('/tasks/0')
        .expect(HttpStatus.OK)
        .set(GenerateHeader(true, true))
        .then((data) => {
          expect(data.body).toBeNull();
        });
    });

    it('should successfully get all tasks', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/tasks')
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.OK);

      expect(body.length).toStrictEqual(tasks().length);
      body.forEach((bodyData, index) => dataToCompare(bodyData, tasks()[index]));
    });

    it('should successfully get one task', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .get(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.OK);

      dataToCompare(body, databaseValue);
      expect(body.id).toStrictEqual(databaseValue.id);
    });
  });

  describe('While testing updating task flows', () => {
    it('should fail updating task with not existing id', () => {
      return request(app.getHttpServer())
        .put('/tasks/0')
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Task Not Found' });
    });

    it('should fail updating task with invalid type of title', () => {
      return request(app.getHttpServer())
        .put('/tasks/1')
        .set(GenerateHeader(true, true))
        .send({ title: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid type of subtitle', () => {
      return request(app.getHttpServer())
        .put('/tasks/1')
        .set(GenerateHeader(true, true))
        .send({ subtitle: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['subtitle must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid type of description', () => {
      return request(app.getHttpServer())
        .put('/tasks/1')
        .set(GenerateHeader(true, true))
        .send({ description: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid type of imageURL', () => {
      return request(app.getHttpServer())
        .put('/tasks/1')
        .set(GenerateHeader(true, true))
        .send({ imageURL: 'imageURL' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['imageURL must be an URL address'],
          error: 'Bad Request',
        });
    });

    it('should successfully update task with valid type of title', async () => {
      const update = { title: 'new task 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update task with valid type of subtitle', async () => {
      const update = {
        title: 'new task 1.1',
        subtitle: 'new task 1.2',
      };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update task with valid type of description', async () => {
      const update = {
        description: 'new task 1.3',
        subtitle: 'new task 1.3',
      };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully set imageURL from string to null', async () => {
      const update = { imageURL: null };
      const [databaseValue] = await repository.find({ take: 1 });
      await repository.update({ id: databaseValue.id }, { imageURL: 'image-url.test' });
      databaseValue.imageURL = 'image-url.test';
      const { body } = await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully set imageURL from null to null', async () => {
      const update = { imageURL: null };
      const [databaseValue] = await repository.find({ take: 1 });
      await repository.update({ id: databaseValue.id }, { imageURL: null });
      databaseValue.imageURL = null;
      const { body } = await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update task with valid type of imageURL', async () => {
      const update = {
        imageURL: 'new-image-url.test',
      };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });
  });

  describe('While testing deleting task flows', () => {
    it('should fail deleting task with not existing id', () => {
      return request(app.getHttpServer())
        .delete('/tasks/0')
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Task Not Found' });
    });

    it('should successfully delete task', () => {
      return request(app.getHttpServer()).delete('/tasks/1').set(GenerateHeader(true, true)).expect(HttpStatus.OK);
    });
  });
});
