import supertest from 'supertest';
import app from '../src/app';
import { jwt } from '../src/utils';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

let request: supertest.SuperTest<supertest.Test>, token: string, sentenceId: number;

const BASE_URL = '/sentences';

describe('[SENTENCE] API TEST', () => {
  beforeAll(async (done) => {
    request = supertest(app);
    token = jwt.sign({ id: 140 }).token;
    done();
  });

  afterAll(async () => {});

  test(`[GET] ${BASE_URL}/recommend`, async (done) => {
    const res = await request
      .get(`${BASE_URL}/recommend`)
      .query({ emotionId: '1', userId: '140' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('추천문장 조회 성공');
    done();
  });

  test(`[GET] ${BASE_URL}`, async (done) => {
    const res = await request.get(BASE_URL).query({ publisher: 'publisher' }).set('Accept', 'application/json');
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
    sentenceId = res.body.data.id;
    done();
  });

  test(`[PUT] ${BASE_URL}/blind`, async (done) => {
    const res = await request
      .put(`${BASE_URL}/blind`)
      .send({
        sentenceId: sentenceId,
      })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('문장블라인드 수정 성공');
    done();
  });

  test(`[DELETE] ${BASE_URL}`, async (done) => {
    const res = await request
      .delete(BASE_URL)
      .send({
        sentenceId: sentenceId,
      })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('문장 삭제 성공');
    done();
  });

  test(`[DELETE] ${BASE_URL}/recommend`, async (done) => {
    const res = await request.delete(`${BASE_URL}/recommend`).set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('추천문장 삭제 성공');
    done();
  });
});
