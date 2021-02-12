import supertest from 'supertest';
import app from '../src/app';
import { jwt } from '../src/utils';
import Diary from '../src/models/diaries_model';
import dayjs from 'dayjs';

let request: supertest.SuperTest<supertest.Test>, token: string, diaryInfo: Diary;

const BASE_URL = '/diaries';

describe('[DIARY] API TEST', () => {
  beforeAll(async (done) => {
    request = supertest(app);
    token = jwt.sign({ id: 1 }).token;
    done();
  });

  test('[GET] /', async (done) => {
    const res = await request.get('/');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
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

  test(`[GET] ${BASE_URL}?order=filter&userId=1&year=2020&month=11&day=1`, async (done) => {
    const res = await request
      .get(BASE_URL)
      .query({ userId: '1', year: '2020', month: '11', order: 'filter', day: '1' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기 전체 조회 성공');
    done();
  });

  test(`[GET] ${BASE_URL}?order=filter&userId=1&year=2020&month=11&emotionId=1&depth=1`, async (done) => {
    const res = await request
      .get(BASE_URL)
      .query({ userId: '1', year: '2020', month: '11', order: 'filter', emotionId: '1', depth: '1' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기 전체 조회 성공');
    done();
  });

  test(`[GET] ${BASE_URL}/recent`, async (done) => {
    const res = await request
      .get(`${BASE_URL}/recent`)
      .query({ userId: '1' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기 최근 미작성 날짜 조회 성공');
    done();
  });

  test(`[GET] ${BASE_URL}/statistics`, async (done) => {
    const res = await request
      .get(`${BASE_URL}/statistics`)
      .query({ userId: '1', year: '2020', month: '1' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기통계 조회 성공');
    done();
  });

  test(`[POST] ${BASE_URL}`, async (done) => {
    const res = await request
      .post(BASE_URL)
      .send({
        contents: 'dummmy',
        userId: 1,
        emotionId: 1,
        sentenceId: 1,
        wroteAt: dayjs().format(),
        depth: 1,
      })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기 생성 성공');
    diaryInfo = res.body.data;
    done();
  });

  test(`[GET] ${BASE_URL}/:id`, async (done) => {
    const res = await request
      .get(`${BASE_URL}/${diaryInfo.id}`)
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기 조회 성공');
    done();
  });

  test(`[PUT] ${BASE_URL}/:id`, async (done) => {
    const res = await request
      .put(`${BASE_URL}/${diaryInfo.id}`)
      .send({ contents: 'dummy2', wroteAt: dayjs().format(), depth: 2 })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기 수정 성공');
    done();
  });

  test(`[DELETE] ${BASE_URL}/:id`, async (done) => {
    const res = await request
      .delete(`${BASE_URL}/${diaryInfo.id}`)
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('일기 삭제 성공');
    done();
  });
});
