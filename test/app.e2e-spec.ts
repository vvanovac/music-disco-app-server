import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

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

    it('should successfully login with valid username and password', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'user1', password: 'password1' })
        .expect(HttpStatus.OK)
        .then((data) => {
          expect(data.body.accessToken).toBeDefined();
          expect(Object.keys(data.body)).toStrictEqual(['accessToken']);
        });
    });
  });

  describe('While testing register flows', () => {
    it('should fail registration with missing username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ password: 'password', email: 'user1@some.thing' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail registration with invalid username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'un',
          password: 'password1',
          email: 'user1@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail registration with missing password', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ username: 'user', email: 'user1@some.thing' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail registration with invalid password', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ username: 'user1', password: 'pw1', email: 'user1@some.thing' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail registration with missing email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ username: 'user1', password: 'password1' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail registration with existing username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'user1',
          password: 'password',
          email: 'user@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail registration with existing email', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({
          username: 'user',
          password: 'password',
          email: 'user1@some.thing',
        })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should successfully register with valid username, password and email', () => {
      const user = {
        username: 'user',
        password: 'password',
        email: 'user@some.thing',
      };
      return request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.CREATED)
        .expect(user);
    });
  });
});
