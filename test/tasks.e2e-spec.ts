import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import Tasks from '../src/tasks/tasks.entity';
import ITask from '../src/tasks/task.interface';

const dataToCompare = (expected, recieved) => {
  expect(expected.title).toStrictEqual(recieved.title);
  expect(expected.subtitle).toStrictEqual(recieved.subtitle);
  expect(expected.description).toStrictEqual(recieved.description);
  expect(expected.imageURL).toStrictEqual(recieved.imageURL);
};

const dataInjected = [
  {
    title: 'test 1',
    subtitle: 'test 1',
    description: 'test 1',
    image: 'image-url.test',
  },
  {
    title: 'test 2',
    subtitle: 'test 2',
    description: 'test 2',
    image: 'image-url.test',
  },
];

describe('Tasks Module', () => {
  let app: INestApplication;
  let repository: Repository<Tasks>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    repository = moduleFixture.get('TasksRepository');
    await repository.save(dataInjected);
  });

  afterEach(async () => {
    await repository.query(`TRUNCATE ${repository.metadata.tablePath} RESTART IDENTITY;`);
    await app.close();
  });

  describe('While testing creating task flows', () => {
    it('should fail creating task with missing title', () => {
      return request(app.getHttpServer())
        .post('/tasks')
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
      const { body } = await request(app.getHttpServer()).post('/tasks').send(create).expect(HttpStatus.CREATED);
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
      const { body } = await request(app.getHttpServer()).post('/tasks').send(create).expect(HttpStatus.CREATED);

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
      const { body } = await request(app.getHttpServer()).post('/tasks').send(create).expect(HttpStatus.CREATED);

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
        .then((data) => {
          expect(data.body).toBeNull();
        });
    });

    it('should successfully get all tasks', async () => {
      const { body } = await request(app.getHttpServer()).get('/tasks').expect(HttpStatus.OK);

      expect(body.length).toStrictEqual(dataInjected.length);
      body.forEach((bodyData, index) => dataToCompare(bodyData, dataInjected[index]));
    });

    it('should successfully get one task', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer()).get(`/tasks/${databaseValue.id}`).expect(HttpStatus.OK);

      dataToCompare(body, databaseValue);
      expect(body.id).toStrictEqual(databaseValue.id);
    });
  });

  describe('While testing updating task flows', () => {
    it('should fail updating task with not existing id', () => {
      return request(app.getHttpServer())
        .put('/tasks/0')
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Task Not Found' });
    });

    it('should fail updating task with invalid type of title', () => {
      return request(app.getHttpServer())
        .put('/tasks/1')
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
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Task Not Found' });
    });

    it('should successfully delete task', () => {
      return request(app.getHttpServer()).delete('/tasks/1').expect(HttpStatus.OK);
    });
  });
});
