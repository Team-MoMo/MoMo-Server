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
      order: [sequelize.fn('RAND')], //order 순서.. order를 랜덤으로 돌려서 3개를 뽑고, 그 뽑은거를 다시 오름차순으로 정렬하는 방법
      limit: 3,
    });
    //정렬 다시보기
    return sentences.sort((a, b) => {
      if (a.id == b.id) {
        return 0;
      }
      return a.id > b.id ? 1 : -1;
    });
  } catch (err) {
    throw err;
  }
};

export const readAllInUserRecommendSentenceIds = async (userRecommendSentenceIds: number[]) => {
  const sentences: Sentence[] = await model.Sentence.findAll({
    attributes: ['id', 'contents', 'writer', 'publisher', 'emotionId'],
    where: {
      id: { [Op.in]: userRecommendSentenceIds },
    },
  });
  return sentences;
};

export const readAllUsersRecommendedSentences = async (emotionId: any, userId: any, date: dayjs.Dayjs) => {
  const sentenceIds: number[] = [];
  const sentences: UsersRecommendedSentences[] = await model.UsersRecommendedSentences.findAll({
    attributes: ['sentenceId'],
    where: {
      emotionId,
      userId,
      createdAt: { [Op.gte]: date },
    },
  });
  sentences.forEach((element) => {
    sentenceIds.push(element.sentenceId);
  });

  return sentenceIds;
};

export const readAllDiaries = async (emotionId: any, userId: any, before30Day: dayjs.Dayjs) => {
  const userDiarySentenceIds: number[] = [];

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

export const createUsersRecommendSentences = async (userId: any, recommendSentences: Sentence[]) => {
  recommendSentences.forEach(async (element) => {
    const create = await model.UsersRecommendedSentences.create({
      userId: userId,
      emotionId: element.emotionId,
      sentenceId: element.id,
      createdAt: dayjs(new Date()).format('YYYY-MM-DD HH:mm'),
    });
  });
  return;
};

//스케줄러 작업하기
