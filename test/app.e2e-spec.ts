import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authentication Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('While testing login flows', () => {
    it('should fail login for missing username', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ password: 'password1' })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ message: 'Login Failed' });
    });

    it('should fail login for missing password', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'user1' })
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({ message: 'Login Failed' });
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
        .send({ password: 'password' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail registration with missing password', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ username: 'user' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should fail registration with existing username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ username: 'user1', password: 'password' })
        .expect(HttpStatus.BAD_REQUEST);
    });

    it('should successfully register with valid username and password', () => {
      const user = { username: 'user', password: 'password' };
      return request(app.getHttpServer())
        .post('/register')
        .send(user)
        .expect(HttpStatus.CREATED)
        .expect(user);
    });
  });
});
