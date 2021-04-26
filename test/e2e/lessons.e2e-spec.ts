import { INestApplication, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import Lessons from '../../src/lessons/lessons.entity';
import { ILesson } from '../../src/lessons/lesson.interface';
import { GenerateSeed, GenerateToken, RemoveSeed, StartServer, StopServer } from '../helpers/common.functions';
import { lessons } from '../helpers/seed.data';
import { DIFFICULTIES_ENUM } from '../../src/common/constants';

const dataToCompare = (expected, received) => {
  expect(expected.title).toStrictEqual(received.title);
  expect(expected.description).toStrictEqual(received.description);
  expect(expected.listOfTasks).toStrictEqual(received.listOfTasks);
  expect(expected.difficulty).toStrictEqual(received.difficulty);
  expect(expected.courseID).toStrictEqual(received.courseID);
};

const GenerateHeader = (generateAuthorization = false, isAdmin = false) => {
  const header: any = {};
  if (generateAuthorization) {
    header.Authorization = `Bearer ${GenerateToken(isAdmin)}`;
  }
  return header;
};

describe('Lessons Module', () => {
  let app: INestApplication;
  let repository: Repository<Lessons>;

  beforeEach(async () => {
    const startTasksData = await StartServer('Lessons');
    app = startTasksData.app;
    repository = startTasksData.repository;
  });

  afterEach(async () => StopServer(app, repository));

  beforeAll(async () => GenerateSeed(['Users']));

  afterAll(() => RemoveSeed(['Users']));

  describe('While testing creating lesson flows', () => {
    it('should fail creating lesson with missing title', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          description: 'lesson 1',
          listOfTasks: [1, 2, 3],
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with invalid type of title', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 1,
          description: 'lesson 1',
          listOfTasks: [1, 2, 3],
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with missing description', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          listOfTasks: [1, 2, 3],
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with invalid type of description', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 1,
          listOfTasks: [1, 2, 3],
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with missing listOfTasks', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['listOfTasks should not be empty', 'listOfTasks must be an array'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with invalid type of listOfTasks', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          listOfTasks: '1, 2, 3',
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['listOfTasks should not be empty', 'listOfTasks must be an array'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with invalid type of array items of listOfTasks', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          listOfTasks: ['task 1', 'task 2', 'task 3'],
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'invalid input syntax for type integer: "task 1"' });
    });

    it('should fail creating lesson with empty array of listOfTasks', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          listOfTasks: [],
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['listOfTasks should not be empty'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with missing difficulty', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          listOfTasks: [1, 2, 3],
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['difficulty must be a valid enum value', 'difficulty must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with invalid type of difficulty', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          difficulty: 1,
          listOfTasks: [1, 2, 3],
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['difficulty must be a valid enum value', 'difficulty must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with invalid enum value of difficulty', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          difficulty: 'DIFFICULTY 1',
          listOfTasks: [1, 2, 3],
          courseID: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['difficulty must be a valid enum value'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with missing courseID', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          listOfTasks: [1, 2, 3],
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['courseID must be a number conforming to the specified constraints'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson with invalid type of courseID', () => {
      return request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send({
          title: 'lesson 1',
          description: 'lesson 1',
          difficulty: DIFFICULTIES_ENUM.BEGINNER,
          listOfTasks: [1, 2, 3],
          courseID: '1',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['courseID must be a number conforming to the specified constraints'],
          error: 'Bad Request',
        });
    });

    it('should fail creating lesson for non admin user', async () => {
      const create: ILesson = {
        title: 'lesson 1',
        description: 'lesson 1',
        difficulty: DIFFICULTIES_ENUM.BEGINNER,
        listOfTasks: [1, 2, 3],
        courseID: 1,
      };
      await request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, false))
        .send(create)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should fail creating lesson without token', async () => {
      const create: ILesson = {
        title: 'lesson 1',
        description: 'lesson 1',
        difficulty: DIFFICULTIES_ENUM.BEGINNER,
        listOfTasks: [1, 2, 3],
        courseID: 1,
      };
      await request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(false, true))
        .send(create)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should successfully create lesson', async () => {
      const create: ILesson = {
        title: 'lesson 1',
        description: 'lesson 1',
        difficulty: DIFFICULTIES_ENUM.BEGINNER,
        listOfTasks: [1, 2, 3],
        courseID: 1,
      };
      const { body } = await request(app.getHttpServer())
        .post('/lessons')
        .set(GenerateHeader(true, true))
        .send(create)
        .expect(HttpStatus.CREATED);
      const lesson = await repository.findOne(body.id);
      dataToCompare(create, lesson);
      dataToCompare(create, body);
    });
  });

  describe('While testing reading lesson flows', () => {
    it('should fail getting one lesson with not existing id', () => {
      return request(app.getHttpServer())
        .get('/lessons/0')
        .expect(HttpStatus.OK)
        .set(GenerateHeader(true, true))
        .then((data) => {
          expect(data.body).toBeNull();
        });
    });

    it('should successfully get all tasks', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/lessons')
        .set(GenerateHeader(true, false))
        .expect(HttpStatus.OK);

      expect(body.length).toStrictEqual(lessons().length);
      body.forEach((bodyData, index) => dataToCompare(bodyData, lessons()[index]));
    });

    it('should successfully get one task', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .get(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
        .expect(HttpStatus.OK);

      dataToCompare(body, databaseValue);
      expect(body.id).toStrictEqual(databaseValue.id);
    });
  });

  describe('While testing updating lesson flows', () => {
    it('should fail updating lesson with not existing id', () => {
      return request(app.getHttpServer())
        .put('/lessons/0')
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Lesson Not Found' });
    });

    it('should fail updating lesson with invalid type of title', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ title: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating lesson with invalid type of description', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ description: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating lesson with invalid type of listOfTasks', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ listOfTasks: '1, 2, 3' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['listOfTasks should not be empty', 'listOfTasks must be an array'],
          error: 'Bad Request',
        });
    });

    it('should fail updating lesson with invalid type of array items of listOfTasks', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ listOfTasks: ['task 1', 'task 2', 'task 3'] })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'invalid input syntax for type integer: "task 1"' });
    });

    it('should fail updating task with invalid type of difficulty', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ difficulty: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['difficulty must be a valid enum value', 'difficulty must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid enum value of difficulty', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ difficulty: 'DIFFICULTY 1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['difficulty must be a valid enum value'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid type of courseID', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ courseID: '1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['courseID must be a number conforming to the specified constraints'],
          error: 'Bad Request',
        });
    });

    it('should fail updating lesson with valid type of title for non admin user', async () => {
      const update = { title: 'new lesson 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
        .send(update)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should fail updating lesson with valid type of title without token', async () => {
      const update = { title: 'new lesson 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(false, true))
        .send(update)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should successfully update lesson with valid type of title', async () => {
      const update = { title: 'new lesson 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update lesson with valid type of description', async () => {
      const update = { description: 'new lesson 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update lesson with valid type of listOfTasks', async () => {
      const update = { listOfTasks: [11, 12, 13] };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update lesson with valid type of difficulty', async () => {
      const update = { difficulty: DIFFICULTIES_ENUM.AMATEUR };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update lesson with valid type of courseID', async () => {
      const update = { courseID: 11 };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });
  });

  describe('While testing deleting lesson flows', () => {
    it('should fail deleting lesson with not existing id', () => {
      return request(app.getHttpServer())
        .delete('/lessons/0')
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Lesson Not Found' });
    });

    it('should fail deleting lesson for non admin user', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should fail deleting lesson without token', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(false, true))
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should successfully delete lesson', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/lessons/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.OK);
    });
  });
});
