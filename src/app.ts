import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

// use env_values
dotenv.config();

import db, { sequelize } from './models';
import indexRouter from './routes/index';
import { normalizePort, handle404Error, handleError } from './middleWares/index';
import database from './configs/database';
import { insertDummy } from './utils';

const app: express.Application = express();

// Database Init & Insert DummyData
(async () => {
  await sequelize.sync({ force: database.init });
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
  database.init && insertDummy(db);
  console.log(`Database Init: ${database.init}`);
  console.log('Sequelize connect success');
  return;
})();

app.set('port', normalizePort(process.env.PORT || '3000'));
app.use(cors());
app.use(process.env.NODE_ENV === 'production' ? logger('combined') : logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(handle404Error);

// error handler
app.use(handleError);

export default app;
