import model from '../models';
import dayjs from 'dayjs';
import { Op } from 'sequelize/types';

export const readAll = async (emotionId: any, userId: any) => {
  try {
    const sentences: object = await model.Sentence.findAll({
      attributes: ['id', 'contents', 'writer', 'publisher', 'emotionId'],
      where: {
        emotionId,
      },
    });
    return sentences;
  } catch (err) {
    throw err;
  }
};

export const readAllUsersRecommendSentences = async (emotionId: any, userId: any) => {
  try {
    const sentences: object = await model.Sentence.findAll({
      attributes: ['id', 'sentenceId', 'emotionId'],
      where: {
        emotionId,
      },
    });
    return sentences;
  } catch (err) {
    throw err;
  }
};

export const readAllDiaries = async (emotionId: any, userId: any, today: any) => {
  console.log(today);
  try {
    const userDiarySentences: object = await model.Diary.findAll({
      attributes: ['sentenceId'],
      where: {
        emotionId,
        userId,
        //날짜 추가
      },
    });
  } catch (err) {}
};

// export const createUsersRecommendSentences = async (usersRecommendSentences: any) => {
//   try {
//     for(const i: number = 0; i < usersRecommendSentences.length; i++) {
//       const createUsersRecommendSentences: object = await model.UsersRecommendedSentences.create()
//     }
//     }

// }
