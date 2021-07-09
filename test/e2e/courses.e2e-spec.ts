import { INestApplication, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import Courses from '../../src/courses/courses.entity';
import { ICourse } from '../../src/courses/courses.interface';
import { GenerateSeed, GenerateToken, RemoveSeed, StartServer, StopServer } from '../helpers/common.functions';
import { courses } from '../helpers/seed.data';

const dataToCompare = (expected, received) => {
  expect(expected.title).toStrictEqual(received.title);
  expect(expected.description).toStrictEqual(received.description);
};

const GenerateHeader = (generateAuthorization = false, isAdmin = false) => {
  const header: any = {};
  if (generateAuthorization) {
    header.Authorization = `Bearer ${GenerateToken(isAdmin)}`;
  }
  return header;
};

describe('Courses Module', () => {
  let app: INestApplication;
  let repository: Repository<Courses>;

  beforeEach(async () => {
    const startCoursesData = await StartServer('Courses');
    app = startCoursesData.app;
    repository = startCoursesData.repository;
  });

  afterEach(async () => StopServer(app, repository));

  beforeAll(async () => GenerateSeed(['Users']));

  afterAll(() => RemoveSeed(['Users']));

  describe('While testing creating course flows', () => {
    it('should fail creating course with missing title', () => {
      return request(app.getHttpServer())
        .post('/courses')
        .set(GenerateHeader(true, true))
        .send({ description: 'course 1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating course with invalid type of title', () => {
      return request(app.getHttpServer())
        .post('/courses')
        .set(GenerateHeader(true, true))
        .send({
          title: 1,
          description: 'course 1',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating course with missing description', () => {
      return request(app.getHttpServer())
        .post('/courses')
        .set(GenerateHeader(true, true))
        .send({ title: 'course 1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating course with invalid type of description', () => {
      return request(app.getHttpServer())
        .post('/courses')
        .set(GenerateHeader(true, true))
        .send({
          title: 'course 1',
          description: 1,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating course for non admin user', async () => {
      const create: ICourse = {
        title: 'course 1',
        description: 'course 1',
      };
      await request(app.getHttpServer())
        .post('/courses')
        .set(GenerateHeader(true, false))
        .send(create)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should fail creating course without token', async () => {
      const create: ICourse = {
        title: 'course 1',
        description: 'course 1',
      };
      await request(app.getHttpServer())
        .post('/courses')
        .set(GenerateHeader(false, true))
        .send(create)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should successfully create course', async () => {
      const create: ICourse = {
        title: 'course 1',
        description: 'course 1',
      };
      const { body } = await request(app.getHttpServer())
        .post('/courses')
        .set(GenerateHeader(true, true))
        .send(create)
        .expect(HttpStatus.CREATED);
      const course = await repository.findOne(body.id);
      dataToCompare(create, course);
      dataToCompare(create, body);
    });
  });

  describe('While testing reading course flows', () => {
    it('should fail getting one course with not existing id', () => {
      return request(app.getHttpServer())
        .get('/courses/0')
        .expect(HttpStatus.OK)
        .set(GenerateHeader(true, true))
        .then((data) => {
          expect(data.body).toBeNull();
        });
    });

    it('should successfully get all courses', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/courses')
        .set(GenerateHeader(true, false))
        .expect(HttpStatus.OK);

      expect(body.length).toStrictEqual(courses().length);
      body.forEach((bodyData, index) => dataToCompare(bodyData, courses()[index]));
    });

    it('should successfully get one course', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .get(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
        .expect(HttpStatus.OK);

      dataToCompare(body, databaseValue);
      expect(body.id).toStrictEqual(databaseValue.id);
    });
  });

  describe('While testing updating course flows', () => {
    it('should fail updating course with not existing id', () => {
      return request(app.getHttpServer())
        .put('/courses/0')
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Course Not Found' });
    });

    it('should fail updating course with invalid type of title', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ title: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating course with invalid type of description', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ description: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating course with valid type of title for non admin user', async () => {
      const update = { title: 'new course 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
        .send(update)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should fail updating course with valid type of title without token', async () => {
      const update = { title: 'new course 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(false, true))
        .send(update)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should successfully update course with valid type of title', async () => {
      const update = { title: 'new course 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update course with valid type of description', async () => {
      const update = { description: 'new course 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .put(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });
  });

  describe('While testing deleting course flows', () => {
    it('should fail deleting course with not existing id', () => {
      return request(app.getHttpServer())
        .delete('/courses/0')
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'Course Not Found' });
    });

    it('should fail deleting course for non admin user', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should fail deleting course without token', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(false, true))
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ statusCode: 401, message: 'Unauthorized' });
    });

    it('should successfully delete course', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/courses/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.OK);
    });
  });
});
