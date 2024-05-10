import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { CreateReviewDto } from '../src/reviews/dto/create-review.dto';
import mongoose, { Types } from 'mongoose';
import {
  USER_NOT_FOUND_ERROR,
  WRONG_PASSWORD_ERROR,
} from '../src/auth/auth.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const loginDto: AuthDto = {
  email: 'asd@asd.asd',
  password: 'asd123',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let access_token: string;

  beforeEach(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto);

    access_token = res.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/login (POST) - success ', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.access_token).toBeDefined();
      });
  });

  it('/auth/login (POST) - failed password ', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, password: 'qwe321' })
      .expect(401, {
        statusCode: 401,
        message: WRONG_PASSWORD_ERROR,
        error: 'Unauthorized',
      });
  });

  it('/auth/login (POST) - failed email ', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ ...loginDto, email: 'zxc@asd.asd' })
      .expect(401, {
        statusCode: 401,
        message: USER_NOT_FOUND_ERROR,
        error: 'Unauthorized',
      });
  });

  afterAll(() => {
    mongoose.disconnect();
  });
});
