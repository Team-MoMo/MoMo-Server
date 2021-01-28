import model from '../models';
import sequelize, { DATE, Op } from 'sequelize';
import dayjs from 'dayjs';
import Diary from '../models/diaries_model';
import Sentence from '../models/sentences_model';
import UsersRecommendedSentences from '../models/users_recommended_sentences_model';
import Emotion from '../models/emotions_model';
import { sentencesController } from '../controllers';

interface CreateSentence {
  contents: string;
  bookName: string;
  writer: string;
  publisher: string;
  emotion: string[];
}

interface SentenceAttributes {
  sentenceId?: number;
  bookName?: string;
  publisher?: string;
  writer?: string;
  blindedAt?: string;
  deletedAt?: string;
}

export const readAll = async ({ sentenceId, bookName, publisher, writer }: SentenceAttributes) => {
  const sentences: Sentence[] = await model.Sentence.findAll({
    where: {
      [Op.and]: [
        !!sentenceId && { id: sentenceId },
        !!bookName && { bookName },
        !!publisher && { publisher },
        !!writer && { writer },
      ],
    },
  });
  return sentences;
};

export const readAllNotInUserSentences = async (emotionId: number, cannotRecommendSentence: number[]) => {
  const sentences: Sentence[] = await model.Sentence.findAll({
    where: {
      id: { [Op.notIn]: cannotRecommendSentence },
      blindedAt: { [Op.or]: [{ [Op.gte]: dayjs(new Date()).add(9, 'hour').format('YYYY-MM-DD HH:mm') }, null] },
    },
    include: [{ model: model.Emotion, where: { id: emotionId }, attributes: [] }],
    order: [sequelize.fn('RAND')],
    limit: 3,
  });
  return sentences.sort((a, b) => {
    if (a.id === b.id) {
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

export const readAllUsersRecommendSentences = async (userId: number) => {
  let userRecommendedSentenceIds: number[] = [];
  const usersRecommendedSentences: UsersRecommendedSentences[] = await model.UsersRecommendedSentences.findAll({
    attributes: ['sentenceId'],
    where: {
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

export const createUsersRecommendSentences = async (
  userId: number,
  emotionId: number,
  recommendSentences: Sentence[]
) => {
  await model.UsersRecommendedSentences.bulkCreate(
    recommendSentences.map((item) => {
      return {
        userId,
        sentenceId: item.id,
        emotionId,
      };
    })
  );
};

export const readAllEmotionIds = async (emotion: string[]) => {
  let emotionIds: number[] = [];
  const emotionInfo: Emotion[] = await model.Emotion.findAll({
    where: {
      name: { [Op.in]: emotion },
    },
  });

  emotionIds = emotionInfo.map((element) => {
    return element.id;
  });
  return emotionIds;
};

export const create = async (body: CreateSentence, emotionId: number[]) => {
  try {
    const createdSentenceTransaction = await model.sequelize.transaction(async (transaction) => {
      const sentenceInfo = await model.Sentence.create(
        {
          contents: body.contents,
          bookName: body.bookName,
          writer: body.writer,
          publisher: body.publisher,
        },
        { transaction }
      );

      await model.EmotionsHaveSentences.bulkCreate(
        emotionId.map((emotionId) => {
          return {
            sentenceId: sentenceInfo.id,
            emotionId,
          };
        }),
        { transaction }
      );
      return sentenceInfo;
    });
    return createdSentenceTransaction;
  } catch (err) {
    throw err;
  }
};

export const updateBlindedAt = async ({ sentenceId, bookName, publisher, writer, blindedAt }: SentenceAttributes) => {
  await model.Sentence.update(
    {
      blindedAt: blindedAt === undefined ? dayjs(new Date()).add(9, 'hour').format('YYYY-MM-DD HH:mm') : blindedAt,
    },
    {
      where: {
        [Op.and]: [
          !!sentenceId && { id: sentenceId },
          !!bookName && { bookName },
          !!publisher && { publisher },
          !!writer && { writer },
        ],
      },
    }
  );

  const updatedSentences = await readAll({ sentenceId, bookName, publisher, writer });
  return updatedSentences;
};

export const deleteAll = async ({ sentenceId, bookName, publisher, writer, deletedAt }: SentenceAttributes) => {
  await model.Sentence.destroy({
    where: {
      [Op.and]: [
        !!sentenceId && { id: sentenceId },
        !!bookName && { bookName },
        !!publisher && { publisher },
        !!writer && { writer },
      ],
    },
  });
};
