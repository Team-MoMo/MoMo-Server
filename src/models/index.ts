import { Sequelize } from 'sequelize';
import database from '../configs/database';

export const sequelize = new Sequelize(database.database, database.username, database.password, {
  host: database.host,
  dialect: 'mysql',
  logging: false,
  timezone: '+09:00',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
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
import UsersRecommendedSentences from './users_recommended_sentences_model';
import EmotionsHaveSentences from './emotions_have_sentences_model';

User.hasMany(Diary, {
  sourceKey: 'id',
  foreignKey: 'userId',
  hooks: true,
  as: 'diaries',
});
Diary.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
});

User.hasMany(Notification, {
  sourceKey: 'id',
  foreignKey: 'userId',
  hooks: true,
  as: 'notifications',
});
Notification.belongsTo(User, {
  targetKey: 'id',
  foreignKey: 'userId',
});

Sentence.hasMany(Diary, {
  sourceKey: 'id',
  foreignKey: 'sentenceId',
  onDelete: 'set null',
  hooks: true,
  as: 'diaries',
});
Diary.belongsTo(Sentence, {
  targetKey: 'id',
  foreignKey: 'sentenceId',
});

Emotion.hasMany(UsersRecommendedSentences, {
  sourceKey: 'id',
  foreignKey: 'emotionId',
  as: 'usersRecommendedSentences',
});
UsersRecommendedSentences.belongsTo(Emotion, {
  targetKey: 'id',
  foreignKey: 'emotionId',
});

Emotion.hasMany(Diary, {
  sourceKey: 'id',
  foreignKey: 'emotionId',
  as: 'diaries',
});
Diary.belongsTo(Emotion, {
  targetKey: 'id',
  foreignKey: 'emotionId',
});

User.belongsToMany(Sentence, {
  through: UsersRecommendedSentences,
  foreignKey: 'userId',
  hooks: true,
});
Sentence.belongsToMany(User, {
  through: UsersRecommendedSentences,
  foreignKey: 'sentenceId',
});

Emotion.belongsToMany(Sentence, {
  through: EmotionsHaveSentences,
  foreignKey: 'emotionId',
});
Sentence.belongsToMany(Emotion, {
  through: EmotionsHaveSentences,
  foreignKey: 'sentenceId',
  hooks: true,
});

const db = {
  sequelize,
  User,
  Diary,
  Emotion,
  Sentence,
  Notification,
  UsersRecommendedSentences,
  EmotionsHaveSentences,
};

export default db;
