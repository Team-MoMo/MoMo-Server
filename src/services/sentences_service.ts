import model from '../models';
import sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import Diary from '../models/diaries_model';
import { randomBytes } from 'crypto';
import Sentence from '../models/sentences_model';
import UsersRecommendedSentences from '../models/users_recommended_sentences_model';

export const readAllNotInUserSentences = async (emotionId: any, userSentences: number[]) => {
  try {
    const sentences: Sentence[] = await model.Sentence.findAll({
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

export const readAllNInUserRecommendSentences = async (userRecommendSentenceIds: number[]) => {
  //readAllUsersRecommendSentences에서 조인해서 한번에 해결할 수 있도록 수정하기
  try {
    const sentences: Sentence[] = await model.Sentence.findAll({
      attributes: ['id', 'contents', 'writer', 'publisher', 'emotionId'],
      where: {
        id: { [Op.in]: userRecommendSentenceIds },
      },
    });
    return sentences;
  } catch (err) {
    throw err;
  }
};

export const readAllUsersRecommendSentences = async (emotionId: any, userId: any) => {
  const sentenceIds: number[] = [];
  const sentences: UsersRecommendedSentences[] = await model.UsersRecommendedSentences.findAll({
    attributes: ['sentenceId'],
    where: {
      emotionId,
      userId,
    },
  });
  sentences.forEach((element) => {
    // console.log(element.sentenceId);
    sentenceIds.push(element.sentenceId);
  });

  return sentenceIds;
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

export const createUsersRecommendSentences = async (userId: number, recommendSentences: Sentence[]) => {
  recommendSentences.forEach(async (element) => {
    const create = await model.UsersRecommendedSentences.create({
      userId: userId,
      emotionId: element.emotionId,
      sentenceId: element.id,
    });
  });
  return;

  // try {
  //   for(const i: number = 0; i < usersRecommendSentences.length; i++) {
  //     const createUsersRecommendSentences: object = await model.UsersRecommendedSentences.create()
  //   }
  //   }
};
