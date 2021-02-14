import supertest from 'supertest';
import app from '../src/app';
import { jwt } from '../src/utils';
require('mysql2/node_modules/iconv-lite').encodingExists('foo');

let request: supertest.SuperTest<supertest.Test>, token: string;

const BASE_URL = '/emotions';

describe('[EMOTION] API TEST', () => {
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
    expect(res.body.message).toEqual('감정 전체 조회 성공');
    done();
  });
});
