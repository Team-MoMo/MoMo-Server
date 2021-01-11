import supertest from 'supertest';
import app from '../src/app';
import { jwt } from '../src/utils';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

let request: supertest.SuperTest<supertest.Test>, token: string;

const BASE_URL = '/users';

describe('[USER] API TEST', () => {
  beforeAll(async (done) => {
    request = supertest(app);
    token = jwt.sign({ id: 1 }).token;
    done();
  });

  afterAll(async () => {});

  test('[GET] /', async (done) => {
    const res = await request.get(BASE_URL).set('Authorization', token).set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('회원 전체 조회 성공');
    done();
  });

  test('[GET] /:id', async (done) => {
    const res = await request
      .get(BASE_URL + '/1')
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('회원 조회 성공');
    done();
  });

  test('[PUT] /:id/alarm(알람설정변경)', async (done) => {
    const res = await request
      .put(BASE_URL + '/1/alarm')
      .send({ isAlarmSet: true })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('알람 수정 성공');
    done();
  });

  test('[PUT] /:id/alarm(알람시간변경)', async (done) => {
    const res = await request
      .put(BASE_URL + '/1/alarm')
      .send({ isAlarmSet: true, alarmTime: '08:00' })
      .set('Authorization', token)
      .set('Accept', 'application/json');
    expect(res).toBeDefined();
    expect(res.status).toEqual(200);
    expect(res.type).toEqual('application/json');
    expect(res.body.message).toEqual('알람 수정 성공');
    done();
  });
});
