import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import Users from '../src/authentication/users.entity';
import constants from '../src/common/constants';
import { hashPassword } from '../src/common/cryptography';

const dataInjected = [
  {
    username: 'test-user0',
    password: 'test-password0',
    email: 'test-user0@some.thing',
  },
];

describe('Authentication Module', () => {
  let app: INestApplication;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    repository = moduleFixture.get('UsersRepository');
    const remapped = await Promise.all(
      dataInjected.map(async ({ password, ...rest }) => {
        const result = await hashPassword(password);
        return { ...rest, ...result };
      }),
    );
    await repository.save(remapped);
  });

  afterEach(async () => {
    await repository.query(`TRUNCATE users RESTART IDENTITY;`);
    await app.close();
  });

  describe('While testing register flows', () => {
    it('should fail registration with missing username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ password: 'test-password1', email: 'test-user1@some.thing' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'username must be longer than or equal to 3 characters',
            'username must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail registration with invalid type of username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 1,
          password: 'test-password1',
          email: 'test-user1@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'username must be longer than or equal to 3 characters',
            'username must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail registration with too short username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'un',
          password: 'test-password1',
          email: 'test-user1@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['username must be longer than or equal to 3 characters'],
          error: 'Bad Request',
        });
    });

    it('should fail registration with missing password', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ username: 'test-user1', email: 'test-user1@some.thing' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'password must be longer than or equal to 8 characters',
            'password must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail registration with invalid type of password', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'test-user1',
          password: 1,
          email: 'test-user1@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'password must be longer than or equal to 8 characters',
            'password must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail registration with too short password', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'test-user1',
          password: 'pw',
          email: 'test-user1@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['password must be longer than or equal to 8 characters'],
          error: 'Bad Request',
        });
    });

    it('should fail registration with missing email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ username: 'test-user1', password: 'test-password1' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        });
    });

    it('should fail registration with invalid type of email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ username: 'test-user1', password: 'test-password1', email: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        });
    });

    it('should fail registration with invalid email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'test-user1',
          password: 'test-password1',
          email: 'test-user.some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        });
    });

    it('should fail registration with existing username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'test-user0',
          password: 'test-password2',
          email: 'test-user2@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'User already exists.' });
    });

    it('should fail registration with existing email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'test-user2',
          password: 'test-password2',
          email: 'test-user0@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'User already exists.' });
    });

    it('should fail registration with invalid type of isAdmin', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'test-user2',
          password: 'test-password2',
          email: 'test-user2@some.thing',
          isAdmin: 'admin',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['isAdmin must be a boolean value'],
          error: 'Bad Request',
        });
    });

    it('should successfully register with mandatory fields', async () => {
      const user = {
        username: 'test-user2',
        password: 'test-password2',
        email: 'test-user2@some.thing',
      };
      const { body } = await request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.CREATED);
      const expectedKeys = ['id', 'username', 'email', 'isAdmin'];
      const receivedKeys = Object.keys(body);
      expect(
        expectedKeys.every((element) => receivedKeys.includes(element)),
      ).toStrictEqual(true);
      expect(expectedKeys.length).toStrictEqual(receivedKeys.length);
    });

    it('should successfully register with mandatory and optional fields', async () => {
      const user = {
        username: 'test-user2',
        password: 'test-password2',
        email: 'test-user2@some.thing',
        isAdmin: false,
      };
      const { body } = await request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.CREATED);
      const expectedKeys = ['id', 'username', 'email', 'isAdmin'];
      const receivedKeys = Object.keys(body);
      expect(
        expectedKeys.every((element) => receivedKeys.includes(element)),
      ).toStrictEqual(true);
      expect(expectedKeys.length).toStrictEqual(receivedKeys.length);
    });

    it('should be able to login after successfully registering', async () => {
      await request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'test-user',
          password: 'test-password0',
          email: 'test-user@some.thing',
        })
        .expect(HttpStatus.CREATED);
      return request(app.getHttpServer())
        .post('/login')
        .send({
          username: 'test-user',
          password: 'test-password0',
        })
        .expect(HttpStatus.OK);
    });

    it('should fail to register with same username twice', async () => {
      const user = {
        username: 'test-user2',
        password: 'test-password2',
        email: 'test-user2@some.thing',
        isAdmin: false,
      };
      await request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.CREATED);
      await request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('While testing login flows', () => {
    it('should fail login for missing username', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ password: 'test-password0' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'username must be longer than or equal to 3 characters',
            'username must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail login for invalid type of username', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 1, password: 'test-password0' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'username must be longer than or equal to 3 characters',
            'username must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail login for too short username', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'un', password: 'test-password0' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['username must be longer than or equal to 3 characters'],
          error: 'Bad Request',
        });
    });

    it('should fail login for missing password', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'test-user0' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'password must be longer than or equal to 8 characters',
            'password must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail login for invalid type of password', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'test-user0', password: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: [
            'password must be longer than or equal to 8 characters',
            'password must be a string',
          ],
          error: 'Bad Request',
        });
    });

    it('should fail login for too short password', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'test-user0', password: 'pw' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['password must be longer than or equal to 8 characters'],
          error: 'Bad Request',
        });
    });

    it('should successfully login with valid username and password', async () => {
      const user = { username: 'test-user0', password: 'test-password0' };
      request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.BAD_REQUEST);

      const { body } = await request(app.getHttpServer())
        .post('/login')
        .send(user)
        .expect(HttpStatus.OK);
      expect(body.accessToken).toBeDefined();
      expect(Object.keys(body)).toStrictEqual(['accessToken']);
      const decoded = new JwtService({ secret: constants.jwt.secret }).verify(
        body.accessToken,
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = decoded;
      expect(decoded.username).toStrictEqual(user.username);
      const expectedKeys = ['username', 'id', 'iat', 'exp'];
      const receivedKeys = Object.keys(rest);
      expect(
        expectedKeys.every((element) => receivedKeys.includes(element)),
      ).toStrictEqual(true);
      expect(expectedKeys.length).toStrictEqual(receivedKeys.length);
      expect(rest.id).toBeDefined();
    });
  });
});
