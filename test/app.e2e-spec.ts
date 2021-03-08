import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Authorization Module', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
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

  it('should fail login for invalid username', () => {
    return request(app.getHttpServer())
      .post('/login')
      .send({})
      .expect(HttpStatus.UNAUTHORIZED)
      .expect({ message: 'Login Failed' });
  });
});
