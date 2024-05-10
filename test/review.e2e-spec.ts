import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { CreateReviewDto } from '../src/reviews/dto/create-review.dto';
import mongoose, { Types } from 'mongoose';
import { REVIEW_NOT_FOUND } from '../src/reviews/review.constants';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();
const loginDto: AuthDto = {
  email: 'asd@asd.asd',
  password: 'asd123',
};

const testDto: CreateReviewDto = {
  name: 'Test',
  rating: 5,
  productId,
};

describe('AppController (e2e)', () => {
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

  it('/reviews/create (POST) - success ', async () => {
    return request(app.getHttpServer())
      .post('/reviews/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined();
      });
  });

  it('/reviews/create (POST) - failed ', async () => {
    return request(app.getHttpServer())
      .post('/reviews/create')
      .send({ ...testDto, rating: 0 })
      .expect(400);
  });

  it('/reviews/byProduct/:productId (GET) - success', async () => {
    return request(app.getHttpServer())
      .get('/reviews/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/reviews/byProduct/:productId (GET) - failed', async () => {
    return request(app.getHttpServer())
      .get('/reviews/byProduct/' + new Types.ObjectId().toHexString())
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });

  it('/reviews/:id (DELETE) - success', () => {
    return request(app.getHttpServer())
      .delete('/reviews/' + createdId)
      .set('Authorization', `Bearer ${access_token}`)
      .expect(200);
  });

  it('/reviews/:id (DELETE) - failed', () => {
    return request(app.getHttpServer())
      .delete('/reviews/' + new Types.ObjectId().toHexString())
      .set('Authorization', `Bearer ${access_token}`)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND,
      });
  });

  afterAll(() => {
    mongoose.disconnect();
  });
});
