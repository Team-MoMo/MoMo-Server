import supertest from 'supertest';
import app from '../src/app';
import { jwt } from '../src/utils';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

let request: supertest.SuperTest<supertest.Test>, token: string, userId: number;

const BASE_URL = '/users';
const randomString = Math.random().toString(36).slice(5);

describe('[USER] API TEST', () => {
  beforeAll(async (done) => {
    request = supertest(app);
    done();
  });

  afterAll(async () => {});

  test(`[GET] ${BASE_URL}/signup?email`, async (done) => {
    const res = await request
      .get(`${BASE_URL}/signup`)
      .query({ email: `${randomString}@gmoil.com` })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('사용 가능한 이메일입니다.');
    done();
  });

  test(`[POST] ${BASE_URL}/signup`, async (done) => {
    const res = await request
      .post(`${BASE_URL}/signup`)
      .send({ email: `${randomString}@gmoil.com`, password: randomString })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(201);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('회원가입 성공');
    done();
  });

  test(`[POST] ${BASE_URL}/social`, async (done) => {
    done();
  });

  test(`[POST] ${BASE_URL}/signin`, async (done) => {
    const res = await request
      .post(`${BASE_URL}/signin`)
      .send({ email: `${randomString}@gmoil.com`, password: randomString })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('로그인 성공');
    userId = res.body.data.user.id;
    token = jwt.sign({ id: userId }).token;
    done();
  });

  test(`[GET] ${BASE_URL}/`, async (done) => {
    const res = await request.get(BASE_URL).set('Authorization', token).set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('회원 전체 조회 성공');
    done();
  });

  test(`[GET] ${BASE_URL}/:id`, async (done) => {
    const res = await request
      .get(`${BASE_URL}/${userId}`)
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('회원 조회 성공');
    done();
  });

  test(`[POST] ${BASE_URL}/:id/password`, async (done) => {
    const res = await request
      .post(`${BASE_URL}/${userId}/password`)
      .send({ password: randomString })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('비밀번호가 일치합니다');
    done();
  });

  test(`[PUT] ${BASE_URL}/:id/password`, async (done) => {
    const res = await request
      .put(`${BASE_URL}/${userId}/password`)
      .send({ newPassword: `${randomString}123` })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('비밀번호 수정 성공');
    done();
  });

  test(`[PUT] ${BASE_URL}/:id/alarm (알람설정변경)`, async (done) => {
    const res = await request
      .put(`${BASE_URL}/${userId}/alarm`)
      .send({ isAlarmSet: true })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('알람 수정 성공');
    done();
  });

  test(`[PUT] ${BASE_URL}/:id/alarm (알람시간변경)`, async (done) => {
    const res = await request
      .put(`${BASE_URL}/${userId}/alarm`)
      .send({ isAlarmSet: true, alarmTime: '08:00' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('알람 수정 성공');
    done();
  });

  test(`[POSt] ${BASE_URL}/password/temp`, async (done) => {
    const res = await request
      .post(`${BASE_URL}/password/temp`)
      .send({ email: `${randomString}@gmoil.com` })
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('임시 비밀번호 수정 성공');
    done();
  });

  test(`[DELETE] ${BASE_URL}/:id`, async (done) => {
    const res = await request
      .delete(`${BASE_URL}/${userId}`)
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('회원 삭제 성공');
    done();
  });
});
