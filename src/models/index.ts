import { Sequelize } from 'sequelize';
import database from '../configs/database';

export const sequelize = new Sequelize(database.database, database.username, database.password, {
  host: database.host,
  dialect: 'mysql',
});

import User from './user';
import Diary from './diary';
import Emotion from './emotion';
import Sentence from './sentence';
import Notification from './notification';

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
  as: 'senetences', // this determines the name in `associations`!
});

Emotion.hasMany(Diary, {
  sourceKey: 'id',
  foreignKey: 'emotionId',
  as: 'diaries', // this determines the name in `associations`!
});

const db = { User, Diary, Emotion, Sentence, Notification };

export default db;
