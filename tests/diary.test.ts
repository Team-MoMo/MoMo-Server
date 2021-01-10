import supertest from 'supertest';
import app from '../src/app';
import { jwt } from '../src/utils';

let request: supertest.SuperTest<supertest.Test>, token: string;

const BASE_URL = '/diaries';

describe('[DIARY] API TEST', () => {
  beforeAll(async (done) => {
    request = supertest(app);
    token = jwt.sign({ id: 1 }).token;
    done();
  });

  afterAll(async () => {});

  test('[GET] /', async (done) => {
    const res = await request.get('/');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    // expect(res.body.data.constructor).toEqual(Array);
    // expect(res.body.data[0]).toMatchObject({
    //   id: expect.any(Number),
    //   name: expect.any(String),
    //   email: expect.any(String),
    //   birthdate: null,
    //   sex: null,
    //   phone: expect.any(String),
    //   point: expect.any(Number),
    //   isAgreeTerms: expect.any(Boolean),
    //   isAgreeUsePersonalData: expect.any(Boolean),
    //   isEmailAuth: expect.any(Boolean),
    //   isPhoneAuth: expect.any(Boolean),
    //   isDeleted: expect.any(Boolean),
    //   createdAt: expect.any(String),
    //   updatedAt: expect.any(String),
    // });
    done();
  });

  test(`[GET] ${BASE_URL}?order=depth`, async (done) => {
    const res = await request
      .get(BASE_URL)
      .query({ userId: '1', year: '2020', month: '11', order: 'depth' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기 전체 조회 성공');
    done();
  });
});
