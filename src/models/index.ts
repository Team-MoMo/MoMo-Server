import { Sequelize } from 'sequelize';
import database from '../configs/database';

export const sequelize = new Sequelize(database.database, database.username, database.password, {
  host: database.host,
  dialect: 'mysql',
  logging: false,
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
});

import User from './users_model';
import Emotion from './emotions_model';
import Sentence from './sentences_model';
import Diary from './diaries_model';
import Notification from './notifications_model';

User.hasMany(Diary, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'diaries',
});

User.hasMany(Notification, {
  sourceKey: 'id',
  foreignKey: 'userId',
  as: 'notifications',
});

Sentence.hasMany(Diary, {
  sourceKey: 'id',
  foreignKey: 'sentenceId',
  as: 'diaries',
});

Emotion.hasMany(Sentence, {
  sourceKey: 'id',
  foreignKey: 'emotionId',
  as: 'sentences',
});

Emotion.hasMany(Diary, {
  sourceKey: 'id',
  foreignKey: 'emotionId',
  as: 'diaries',
});

const db = { User, Diary, Emotion, Sentence, Notification };

export default db;
