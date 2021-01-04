import model from '../models';
import sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import Diary from '../models/diaries_model';
import Sentence from '../models/sentences_model';
import UsersRecommendedSentences from '../models/users_recommended_sentences_model';

export const readAllNotInUserSentences = async (emotionId: any, userSentences: number[]) => {
  const sentences: Sentence[] = await model.Sentence.findAll({
    attributes: ['id', 'contents', 'writer', 'publisher', 'emotionId'],
    where: {
      emotionId,
      id: { [Op.notIn]: userSentences },
    },
    order: [sequelize.fn('RAND')],
    limit: 3,
  });
  return sentences.sort((a, b) => {
    if (a.id == b.id) {
      return 0;
    }
    return a.id > b.id ? 1 : -1;
  });
};

export const readAllInUserRecommendSentences = async (userRecommendSentenceIds: number[]) => {
  const sentences: Sentence[] = await model.Sentence.findAll({
    attributes: ['id', 'contents', 'writer', 'publisher', 'emotionId'],
    where: {
      id: { [Op.in]: userRecommendSentenceIds },
    },
  });
  return sentences;
};

export const readAllUsersRecommendSentencesAfter6 = async (emotionId: any, userId: any, date: dayjs.Dayjs) => {
  const userRecommendedsentenceIds: number[] = [];

  const usersRecommendedSentences: UsersRecommendedSentences[] = await model.UsersRecommendedSentences.findAll({
    attributes: ['sentenceId'],
    where: {
      emotionId,
      userId,
      createdAt: { [Op.gte]: date },
    },
  });
  usersRecommendedSentences.forEach((element) => {
    userRecommendedsentenceIds.push(element.sentenceId);
  });

  return userRecommendedsentenceIds;
};

export const readAllUsersRecommendSentences = async (emotionId: any, userId: any) => {
  const userRecommendedsentenceIds: number[] = [];
  const usersRecommendedSentences: UsersRecommendedSentences[] = await model.UsersRecommendedSentences.findAll({
    attributes: ['sentenceId'],
    where: {
      emotionId,
      userId,
    },
  });
  usersRecommendedSentences.forEach((element) => {
    userRecommendedsentenceIds.push(element.sentenceId);
  });

  return userRecommendedsentenceIds;
};

export const readAllDiaries = async (emotionId: any, userId: any) => {
  const userDiarySentenceIds: number[] = [];

  const before30Day = dayjs(new Date()).subtract(30, 'day');
  const userDiarySentences: Diary[] = await model.Diary.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('sentenceId')), 'sentenceId']],
    where: {
      emotionId,
      userId,
      createdAt: { [Op.lt]: before30Day },
    },
  });
  userDiarySentences.forEach((element) => {
    userDiarySentenceIds.push(element.sentenceId);
  });

  return userDiarySentenceIds;
};

export const createUsersRecommendSentences = async (userId: number, recommendSentences: Sentence[]) => {
  recommendSentences.forEach(async (element) => {
    await model.UsersRecommendedSentences.create({
      userId: userId,
      emotionId: element.emotionId,
      sentenceId: element.id,
    });
  });
  return;
};
