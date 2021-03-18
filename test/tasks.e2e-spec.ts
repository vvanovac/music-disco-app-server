import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import Tasks from '../src/tasks/tasks.entity';

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
    await repository.save([
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
    ]);
  });

  afterEach(async () => {
    await repository.query(`TRUNCATE tasks RESTART IDENTITY;`);
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

    it('should successfully create task with mandatory fields', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 'task 1',
        })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          repository.findOne(body.id);
          expect(body.title).toStrictEqual('task 1');
          expect(body.subtitle).toStrictEqual('task 1');
          expect(body.description).toStrictEqual('task 1');
        });
    });

    it('should successfully create task with mandatory and optional fields', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 'task 1',
          imageURL: 'image-url.test',
        })
        .expect(HttpStatus.CREATED)
        .then(({ body }) => {
          repository.findOne(body.id);
          expect(body.title).toStrictEqual('task 1');
          expect(body.subtitle).toStrictEqual('task 1');
          expect(body.description).toStrictEqual('task 1');
          expect(body.imageURL).toStrictEqual('image-url.test');
        });
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

    it('should successfully get all tasks', () => {
      return request(app.getHttpServer())
        .get('/tasks')
        .expect(HttpStatus.OK)
        .then((data) => {
          expect(data.body).toBeDefined();
        });
    });

    it('should successfully get one task', () => {
      return request(app.getHttpServer()).get('/tasks/1').expect(HttpStatus.OK);
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

    it('should successfully update task with valid type of title', () => {
      const update = { title: 'task 1' };
      return request(app.getHttpServer())
        .put('/tasks/1')
        .send(update)
        .expect(HttpStatus.OK)
        .expect(update);
    });

    it('should successfully update task with valid type of subtitle', () => {
      const update = { subtitle: 'task 1' };
      return request(app.getHttpServer())
        .put('/tasks/1')
        .send(update)
        .expect(HttpStatus.OK)
        .expect(update);
    });

    it('should successfully update task with valid type of description', () => {
      const update = { description: 'task 1' };
      return request(app.getHttpServer())
        .put('/tasks/1')
        .send(update)
        .expect(HttpStatus.OK)
        .expect(update);
    });

    it('should successfully update task with valid type of imageURL', () => {
      const update = { imageURL: 'image-url.test' };
      return request(app.getHttpServer())
        .put('/tasks/1')
        .send(update)
        .expect(HttpStatus.OK)
        .expect(update);
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
      return request(app.getHttpServer())
        .delete('/tasks/1')
        .expect(HttpStatus.OK);
    });
  });
});
