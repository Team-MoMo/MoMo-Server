import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import yaml from 'yamljs';
import swaggerUi from 'swagger-ui-express';

// use env_values
dotenv.config();

import db, { sequelize } from './models';
import indexRouter from './routes/index';
import { normalizePort, handle404Error, handleError } from './middleWares/index';
import database from './configs/database';
import { dbDummy } from './utils';

const app: express.Application = express();
const swaggerSpec = yaml.load(path.join(__dirname, './docs/openapi.yaml'));

// Database Init & Insert DummyData
(async () => {
  await sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });
  await sequelize.sync({ force: database.init });
  database.init && process.env.NODE_ENV === 'development' && (await dbDummy(db));

  if (process.env.NODE_ENV !== 'test') {
    console.log(`Database Init: ${database.init}`);
    console.log('Sequelize connect success');
  }

  database.init && process.exit();
})();

app.set('port', normalizePort(process.env.PORT || '3000'));
app.use(cors());
process.env.NODE_ENV !== 'test' && app.use(logger(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', indexRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// catch 404 and forward to error handler
app.use(handle404Error);

// error handler
app.use(handleError);

export default app;
