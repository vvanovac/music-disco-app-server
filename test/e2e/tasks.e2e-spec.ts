import { INestApplication, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import Tasks from '../../src/tasks/tasks.entity';
import { ITask } from '../../src/tasks/task.interface';
import { GenerateSeed, GenerateToken, RemoveSeed, StartServer, StopServer } from '../helpers/common.functions';
import { tasks } from '../helpers/seed.data';
import { MUSIC_NOTES_ENUM, OCTAVE_ENUM } from '../../src/common/constants';

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
        .send({
          subtitle: 'task 1',
          description: 'task 1',
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
          octave: OCTAVE_ENUM.FOUR,
        })
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
        .send({
          title: 1,
          subtitle: 'task 1',
          description: 'task 1',
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
          octave: OCTAVE_ENUM.FOUR,
        })
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
        .send({
          title: 'task 1',
          description: 'task 1',
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
          octave: OCTAVE_ENUM.FOUR,
        })
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
        .send({
          title: 'task 1',
          subtitle: 1,
          description: 'task 1',
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
          octave: OCTAVE_ENUM.FOUR,
        })
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
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
          octave: OCTAVE_ENUM.FOUR,
        })
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
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 1,
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
          octave: OCTAVE_ENUM.FOUR,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with missing musicNotes', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({ title: 'task 1', subtitle: 'task 1', description: 'task 1', octave: OCTAVE_ENUM.FOUR })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'each value in musicNotes must be a valid enum value',
            'musicNotes should not be empty',
            'musicNotes must be an array',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with empty musicNotes array', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({ title: 'task 1', subtitle: 'task 1', description: 'task 1', musicNotes: [], octave: OCTAVE_ENUM.FOUR })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['musicNotes should not be empty'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with invalid type of musicNotes', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 'task 1',
          musicNotes: 'C2, D2, E2',
          octave: OCTAVE_ENUM.FOUR,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'each value in musicNotes must be a valid enum value',
            'musicNotes should not be empty',
            'musicNotes must be an array',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with invalid enum value of musicNotes', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 'task 1',
          musicNotes: ['C1', 'D1', 'E1'],
          octave: OCTAVE_ENUM.FOUR,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['each value in musicNotes must be a valid enum value'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with missing octave', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 'task 1',
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['octave must be a valid enum value', 'octave must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with invalid type of octave', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 'task 1',
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
          octave: 4,
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['octave must be a valid enum value', 'octave must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task with invalid enum value of octave', () => {
      return request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, true))
        .send({
          title: 'task 1',
          subtitle: 'task 1',
          description: 'task 1',
          musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
          octave: 'ONE',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['octave must be a valid enum value'],
          error: 'Bad Request',
        });
    });

    it('should fail creating task for non admin user', async () => {
      const create: ITask = {
        title: 'task 1',
        subtitle: 'task 1',
        description: 'task 1',
        musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
        octave: OCTAVE_ENUM.FOUR,
      };
      await request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(true, false))
        .send(create)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should fail creating task without token', async () => {
      const create: ITask = {
        title: 'task 1',
        subtitle: 'task 1',
        description: 'task 1',
        musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
        octave: OCTAVE_ENUM.FOUR,
      };
      await request(app.getHttpServer())
        .post('/tasks')
        .set(GenerateHeader(false, true))
        .send(create)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should successfully create task', async () => {
      const create: ITask = {
        title: 'task 1',
        subtitle: 'task 1',
        description: 'task 1',
        musicNotes: [MUSIC_NOTES_ENUM.C, MUSIC_NOTES_ENUM.D, MUSIC_NOTES_ENUM.E],
        octave: OCTAVE_ENUM.FOUR,
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
        .set(GenerateHeader(true, false))
        .then((data) => {
          expect(data.body).toBeNull();
        });
    });

    it('should successfully get all tasks', async () => {
      const { body } = await request(app.getHttpServer())
        .get('/tasks')
        .set(GenerateHeader(true, false))
        .expect(HttpStatus.OK);

      expect(body.length).toStrictEqual(tasks().length);
      body.forEach((bodyData, index) => dataToCompare(bodyData, tasks()[index]));
    });

    it('should successfully get one task', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      const { body } = await request(app.getHttpServer())
        .get(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
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

    it('should fail updating task with invalid type of title', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ title: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['title must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid type of subtitle', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ subtitle: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['subtitle must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid type of description', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ description: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['description must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid type of musicNotes', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ musicNotes: 'C D E' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'each value in musicNotes must be a valid enum value',
            'musicNotes should not be empty',
            'musicNotes must be an array',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid enum value of musicNotes', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ musicNotes: ['C1', 'D1', 'E1'] })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['each value in musicNotes must be a valid enum value'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid type of octave', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ octave: 4 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['octave must be a valid enum value', 'octave must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with invalid enum value of octave', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send({ octave: 'ONE' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['octave must be a valid enum value'],
          error: 'Bad Request',
        });
    });

    it('should fail updating task with valid type of title for non admin user', async () => {
      const update = { title: 'new task 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
        .send(update)
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should fail updating task with valid type of title without token', async () => {
      const update = { title: 'new task 1.1' };
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(false, true))
        .send(update)
        .expect(HttpStatus.UNAUTHORIZED);
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

    it('should successfully update task with valid type of musicNotes', async () => {
      const update = { musicNotes: [MUSIC_NOTES_ENUM.A, MUSIC_NOTES_ENUM.B, MUSIC_NOTES_ENUM.C] };
      const [databaseValue] = await repository.find({ take: 1 });
      await repository.update(
        { id: databaseValue.id },
        { musicNotes: [MUSIC_NOTES_ENUM.A, MUSIC_NOTES_ENUM.B, MUSIC_NOTES_ENUM.C] },
      );
      databaseValue.musicNotes = [MUSIC_NOTES_ENUM.A, MUSIC_NOTES_ENUM.B, MUSIC_NOTES_ENUM.C];
      const { body } = await request(app.getHttpServer())
        .put(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .send(update)
        .expect(HttpStatus.OK);
      const newDatabaseValue = await repository.findOne(databaseValue.id);
      dataToCompare(body, newDatabaseValue);
      dataToCompare({ ...databaseValue, ...update }, newDatabaseValue);
    });

    it('should successfully update task with valid type of octave', async () => {
      const update = { octave: OCTAVE_ENUM.FIVE };
      const [databaseValue] = await repository.find({ take: 1 });
      await repository.update({ id: databaseValue.id }, { octave: OCTAVE_ENUM.FIVE });
      databaseValue.octave = OCTAVE_ENUM.FIVE;
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

    it('should fail deleting task for non admin user', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, false))
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should fail deleting task without token', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(false, true))
        .expect(HttpStatus.UNAUTHORIZED);
    });

    it('should successfully delete task', async () => {
      const [databaseValue] = await repository.find({ take: 1 });
      await request(app.getHttpServer())
        .delete(`/tasks/${databaseValue.id}`)
        .set(GenerateHeader(true, true))
        .expect(HttpStatus.OK);
    });
  });
});
