import supertest from 'supertest';
import app from '../src/app';
import { jwt } from '../src/utils';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

let request: supertest.SuperTest<supertest.Test>, token: string;

const BASE_URL = '/sentences';

describe('[SENTENCE] API TEST', () => {
  beforeAll(async (done) => {
    request = supertest(app);
    token = jwt.sign({ id: 1 }).token;
    done();
  });

  afterAll(async () => {});

  test(`[GET] ${BASE_URL}/`, async (done) => {
    const res = await request
      .get(BASE_URL)
      .query({ emotionId: '1', userId: '1' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('문장 조회 성공');
    done();
  });

  test(`[GET] ${BASE_URL}/onboarding`, async (done) => {
    const res = await request.get(`${BASE_URL}/onboarding`).query({ emotionId: '1' }).set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('온보딩문장 조회 성공');
    done();
  });

  test(`[POST] ${BASE_URL}/`, async (done) => {
    const res = await request
      .post(BASE_URL)
      .send({
        contents: 'contents',
        bookName: 'bookName',
        writer: 'writer',
        publisher: 'publisher',
        emotion: ['사랑', '행복'],
      })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('문장 생성 성공');
    done();
  });
});
