export default {
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.NODE_ENV === 'production' ? process.env.DATABASE_NAME : 'momo_dev',
  host: process.env.DATABASE_HOST,
  dialect: process.env.DATABASE_DIALECT,
  init: process.env.DATABASE_INIT === 'true',
};
