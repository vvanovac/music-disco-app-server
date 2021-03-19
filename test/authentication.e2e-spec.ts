import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import constants from '../src/common/constants';

describe('Authentication Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('While testing login flows', () => {
    it('should fail login for missing username', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ password: 'password1' })
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
        .send({ username: 1, password: 'password1' })
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
        .send({ username: 'un', password: 'password1' })
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
        .send({ username: 'user1' })
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
        .send({ username: 'user1', password: 1 })
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
        .send({ username: 'user1', password: 'pw' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['password must be longer than or equal to 8 characters'],
          error: 'Bad Request',
        });
    });

    it('should successfully login with valid username and password', async () => {
      const user = { username: 'user1', password: 'password1' };
      const { body } = await request(app.getHttpServer())
        .post('/login')
        .send(user)
        .expect(HttpStatus.OK);
      expect(body.accessToken).toBeDefined();
      expect(Object.keys(body)).toStrictEqual(['accessToken']);
      const decoded = new JwtService({ secret: constants.jwt.secret }).verify(
        body.accessToken,
      );
      expect(decoded.username).toStrictEqual(user.username);
      const expectedKeys = ['username', 'id', 'iat', 'exp'];
      const receivedKeys = Object.keys(decoded);
      expect(
        expectedKeys.every((element) => receivedKeys.includes(element)),
      ).toStrictEqual(true);
      expect(expectedKeys.length).toStrictEqual(receivedKeys.length);
      expect(decoded.id).toBeDefined();
    });
  });

  describe('While testing register flows', () => {
    it('should fail registration with missing username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ password: 'password', email: 'user1@some.thing' })
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
          password: 'password1',
          email: 'user1@some.thing',
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
          password: 'password1',
          email: 'user1@some.thing',
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
        .send({ username: 'user', email: 'user1@some.thing' })
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
        .send({ username: 'user1', password: 1, email: 'user1@some.thing' })
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
        .send({ username: 'user1', password: 'pw', email: 'user1@some.thing' })
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
        .send({ username: 'user1', password: 'password1' })
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
        .send({ username: 'user1', password: 'password1', email: 1 })
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
          username: 'user1',
          password: 'password1',
          email: 'user1some.thing',
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
          username: 'user1',
          password: 'password',
          email: 'user@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'User already exists.' });
    });

    it('should fail registration with existing email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'user',
          password: 'password',
          email: 'user1@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({ message: 'User already exists.' });
    });

    it('should fail registration with invalid type of isAdmin', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'user',
          password: 'password',
          email: 'user1@some.thing',
          isAdmin: 'admin',
        })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: 400,
          message: ['isAdmin must be a boolean value'],
          error: 'Bad Request',
        });
    });

    it('should successfully register with mandatory fields', () => {
      const user = {
        username: 'user',
        password: 'password',
        email: 'user@some.thing',
      };
      return request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.CREATED)
        .expect({ isAdmin: false, ...user });
    });

    it('should successfully register with mandatory and optional fields', () => {
      const user = {
        username: 'newUser',
        password: 'password',
        email: 'newUser@some.thing',
        isAdmin: false,
      };
      return request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.CREATED)
        .expect(user);
    });

    it('should be able to login after successfully registering', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({
          username: 'newUser',
          password: 'password',
        })
        .expect(HttpStatus.OK);
    });

    it('should fail to register with same username twice', () => {
      const user = {
        username: 'newUser',
        password: 'password',
        email: 'newUser@some.thing',
        isAdmin: false,
      };
      return request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.BAD_REQUEST);
    });
  });
});
