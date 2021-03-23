import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import Users from '../src/authentication/users.entity';
import { jwt } from '../src/common/constants';
import { hashPassword } from '../src/common/cryptography';

const dataInjected = [
  {
    username: 'test-user0',
    password: 'test-password0',
    email: 'test-user0@some.thing',
    isAdmin: false,
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
    await repository.query(`TRUNCATE ${repository.metadata.tablePath} RESTART IDENTITY;`);
    await app.close();
  });

  describe('While testing register flows', () => {
    it('should fail registration with missing username', () => {
      return request(app.getHttpServer())
        .post('/register')
        .send({ password: 'test-password1', email: 'test-user1@some.thing' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['username must be longer than or equal to 3 characters', 'username must be a string'],
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
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['username must be longer than or equal to 3 characters', 'username must be a string'],
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
          statusCode: HttpStatus.BAD_REQUEST,
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
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['password must be longer than or equal to 8 characters', 'password must be a string'],
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
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['password must be longer than or equal to 8 characters', 'password must be a string'],
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
          statusCode: HttpStatus.BAD_REQUEST,
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
          statusCode: HttpStatus.BAD_REQUEST,
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
          statusCode: HttpStatus.BAD_REQUEST,
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
          statusCode: HttpStatus.BAD_REQUEST,
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
          statusCode: HttpStatus.BAD_REQUEST,
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
      const { body } = await request(app.getHttpServer()).post('/register').send(user).expect(HttpStatus.CREATED);
      const expectedKeys = ['username', 'email', 'isAdmin'];
      const receivedKeys = Object.keys(body);
      expect(expectedKeys.every((element) => receivedKeys.includes(element))).toStrictEqual(true);
      expect(expectedKeys.length).toStrictEqual(receivedKeys.length);
    });

    it('should successfully register with mandatory and optional fields', async () => {
      const user = {
        username: 'test-user2',
        password: 'test-password2',
        email: 'test-user2@some.thing',
        isAdmin: false,
      };
      const { body } = await request(app.getHttpServer()).post('/register').send(user).expect(HttpStatus.CREATED);
      const expectedKeys = ['username', 'email', 'isAdmin'];
      const receivedKeys = Object.keys(body);
      expect(expectedKeys.every((element) => receivedKeys.includes(element))).toStrictEqual(true);
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
      await request(app.getHttpServer()).post('/register').send(user).expect(HttpStatus.CREATED);
      await request(app.getHttpServer()).post('/register').send(user).expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('While testing login flows', () => {
    it('should fail login for missing username', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ password: 'test-password0' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['username must be longer than or equal to 3 characters', 'username must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail login for invalid type of username', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 1, password: 'test-password0' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['username must be longer than or equal to 3 characters', 'username must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail login for too short username', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'un', password: 'test-password0' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
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
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['password must be longer than or equal to 8 characters', 'password must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail login for invalid type of password', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'test-user0', password: 1 })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['password must be longer than or equal to 8 characters', 'password must be a string'],
          error: 'Bad Request',
        });
    });

    it('should fail login for too short password', () => {
      return request(app.getHttpServer())
        .post('/login')
        .send({ username: 'test-user0', password: 'pw' })
        .expect(HttpStatus.BAD_REQUEST)
        .expect({
          statusCode: HttpStatus.BAD_REQUEST,
          message: ['password must be longer than or equal to 8 characters'],
          error: 'Bad Request',
        });
    });

    it('should successfully login with valid username and password', async () => {
      const user = { username: 'test-user0', password: 'test-password0' };
      request(app.getHttpServer()).post('/register').send(user).expect(HttpStatus.BAD_REQUEST);

      const { body } = await request(app.getHttpServer()).post('/login').send(user).expect(HttpStatus.OK);
      expect(body.accessToken).toBeDefined();
      expect(Object.keys(body)).toStrictEqual(['accessToken']);
      const decoded = new JwtService({ secret: jwt.secret }).verify(body.accessToken);
      expect(decoded.username).toStrictEqual(user.username);
      const expectedKeys = ['username', 'id', 'isAdmin', 'iat', 'exp'];
      const receivedKeys = Object.keys(decoded);
      expect(expectedKeys.every((element) => receivedKeys.includes(element))).toStrictEqual(true);
      expect(expectedKeys.length).toStrictEqual(receivedKeys.length);
      const databaseUser = await repository.findOne(decoded.id);
      expect(databaseUser.username).toStrictEqual(decoded.username);
      expect(databaseUser.isAdmin).toStrictEqual(decoded.isAdmin);
    });
  });

  describe('While testing token validation flows', () => {
    let token;
    const userUsed = dataInjected[0];

    beforeEach(async () => {
      const { body } = await request(app.getHttpServer()).post('/login').send(userUsed);
      token = `Bearer ${body.accessToken}`;
    });

    it('should fail returning current user with missing token', async () => {
      await request(app.getHttpServer())
        .get('/currentUser')
        .set('Authorization', '')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should fail returning current user with invalid token', async () => {
      token = token.replace(token.slice(token.length - 5), 'a!b!c');
      await request(app.getHttpServer())
        .get('/currentUser')
        .set('Authorization', token)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should fail returning current user with expired token', async () => {
      const { iat, exp } = new JwtService({
        secret: jwt.secret,
      }).verify(token.replace('Bearer ', ''));
      await new Promise((resolve) => setTimeout(resolve, (exp - iat) * 1000 + 5));
      await request(app.getHttpServer())
        .get('/currentUser')
        .set('Authorization', token)
        .expect(HttpStatus.UNAUTHORIZED)
        .expect({
          statusCode: 401,
          message: 'Unauthorized',
        });
    });

    it('should return current user', async () => {
      const { body: currentUser } = await request(app.getHttpServer())
        .get('/currentUser')
        .set('Authorization', token)
        .expect(HttpStatus.OK);
      expect(currentUser.username).toStrictEqual(userUsed.username);
      expect(currentUser.isAdmin).toStrictEqual(userUsed.isAdmin);
      expect(currentUser.email).toStrictEqual(userUsed.email);
      expect(currentUser.password).toBeUndefined();
      expect(currentUser.hash).toBeUndefined();
      expect(currentUser.salt).toBeUndefined();
    });
  });
});
