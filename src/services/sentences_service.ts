import model from '../models';
import sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';
import Diary from '../models/diaries_model';
import Sentence from '../models/sentences_model';
import UsersRecommendedSentences from '../models/users_recommended_sentences_model';

export const readAllNotInUserSentences = async (emotionId: number, cannotRecommendSentence: number[]) => {
  const sentences: Sentence[] = await model.Sentence.findAll({
    where: {
      emotionId,
      id: { [Op.notIn]: cannotRecommendSentence },
    },
    order: [sequelize.fn('RAND'), ['id', 'DESC']],
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
    where: {
      id: { [Op.in]: userRecommendSentenceIds },
    },
  });
  return sentences;
};

export const readAllUsersRecommendSentencesAfter6 = async (emotionId: number, userId: number, date: dayjs.Dayjs) => {
  let userRecommendedSentenceIds: number[] = [];

  const usersRecommendedSentences: UsersRecommendedSentences[] = await model.UsersRecommendedSentences.findAll({
    attributes: ['sentenceId'],
    where: {
      emotionId,
      userId,
      createdAt: { [Op.gte]: date.format('YYYY-MM-DD HH:mm') },
    },
  });
  userRecommendedSentenceIds = usersRecommendedSentences.map((element) => {
    return element.sentenceId;
  });

  return userRecommendedSentenceIds;
};

export const readAllUsersRecommendSentences = async (emotionId: number, userId: number) => {
  let userRecommendedSentenceIds: number[] = [];
  const usersRecommendedSentences: UsersRecommendedSentences[] = await model.UsersRecommendedSentences.findAll({
    attributes: ['sentenceId'],
    where: {
      emotionId,
      userId,
    },
  });
  userRecommendedSentenceIds = usersRecommendedSentences.map((element) => {
    return element.sentenceId;
  });
  return userRecommendedSentenceIds;
};

export const readAllDiaries = async (emotionId: number, userId: number, before30Day: dayjs.Dayjs) => {
  let userDiarySentenceIds: number[] = [];

  const userDiarySentences: Diary[] = await model.Diary.findAll({
    attributes: [[sequelize.fn('DISTINCT', sequelize.col('sentenceId')), 'sentenceId']],
    where: {
      emotionId,
      userId,
      createdAt: { [Op.gt]: before30Day.format('YYYY-MM-DD HH:mm') },
    },
  });

  userDiarySentenceIds = userDiarySentences.map((element) => {
    return element.sentenceId;
  });

  return userDiarySentenceIds;
};

export const createUsersRecommendSentences = async (userId: number, recommendSentences: Sentence[]) => {
  await model.UsersRecommendedSentences.bulkCreate([
    { userId: userId, emotionId: recommendSentences[0].emotionId, sentenceId: recommendSentences[0].id },
    { userId: userId, emotionId: recommendSentences[1].emotionId, sentenceId: recommendSentences[1].id },
    { userId: userId, emotionId: recommendSentences[2].emotionId, sentenceId: recommendSentences[2].id },
  ]);
};
