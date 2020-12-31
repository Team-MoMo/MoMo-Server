import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';

import indexRouter from './routes/index';
import { normalizePort, handle404Error, handleError } from './middleWares/index';

const app: express.Application = express();

// use env_values
dotenv.config();

const { sequelize } = require('./models');
sequelize
  .sync({
    alter: false,
  })
  .then(() => {
    console.log('Sequelize Sync Success');
  })
  .catch((error: any) => {
    console.error(error);
  });

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
