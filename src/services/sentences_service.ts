import model from '../models';
import sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import Diary from '../models/diaries_model';
import { randomBytes } from 'crypto';

export const readAll = async (emotionId: any, userSentences: number[]) => {
  try {
    const sentences: object[] = await model.Sentence.findAll({
      attributes: ['id', 'contents', 'writer', 'publisher', 'emotionId'],
      where: {
        emotionId,
        id: { [Op.notIn]: userSentences },
      },
      order: [sequelize.fn('RAND')],
      limit: 3,
    });
    return sentences;
  } catch (err) {
    throw err;
  }
};

export const readAllUsersRecommendSentences = async (emotionId: any, userId: any) => {
  const sentences: object[] = await model.UsersRecommendedSentences.findAll({
    attributes: ['id', 'sentenceId', 'emotionId'],
    where: {
      emotionId,
      userId,
    },
  });

  return sentences;
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
    // console.log(element.sentenceId);
    userDiarySentenceIds.push(element.sentenceId);
  });

  return userDiarySentenceIds;
};

export const createUsersRecommendSentences = async (usersRecommendSentences: any) => {
  // try {
  //   for(const i: number = 0; i < usersRecommendSentences.length; i++) {
  //     const createUsersRecommendSentences: object = await model.UsersRecommendedSentences.create()
  //   }
  //   }
};
