import model from '../models';
import Diary from '../models/diaries_model';
import { random } from '../utils';
import sequelize, { Op } from 'sequelize';
import dayjs from 'dayjs';

interface ReadAllAttributes {
  userId: number;
  year: number;
  month: number;
  day?: number;
  emotionId?: number;
  depth?: number;
}

export const readAll = async (userId: number) => {
  const diaryList = await model.Diary.findAll({
    where: { userId },
    include: [
      {
        model: model.Sentence,
        include: [
          {
            model: model.Emotion,
          },
        ],
      },
    ],
  });
  return diaryList;
};

export const readAllByDepth = async ({ userId, year, month }: ReadAllAttributes) => {
  const standardTime = dayjs(`${year}-${month}-01`);
  const addedTime = standardTime.add(1, 'month');
  const diaryListByDepth = await model.Diary.findAll({
    where: {
      userId,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
    },
    include: [
      {
        model: model.Sentence,
        include: [
          {
            model: model.Emotion,
          },
        ],
      },
    ],
    order: [
      ['depth', 'ASC'],
      ['id', 'ASC'],
    ],
  });
  return diaryListByDepth;
};

export const readAllByDate = async ({ userId, year, month, day }: ReadAllAttributes) => {
  const standardTime = dayjs(`${year}-${month}-${day || '01'}`);
  const addedTime = day ? standardTime.add(1, 'day') : standardTime.add(1, 'month');
  const diaryListByDate = await model.Diary.findAll({
    where: {
      userId,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
    },
    include: [
      {
        model: model.Sentence,
        include: [
          {
            model: model.Emotion,
          },
        ],
      },
    ],
    order: [['id', 'ASC']],
  });
  return diaryListByDate;
};

export const readAllByFilter = async ({ userId, year, month, emotionId, depth }: ReadAllAttributes) => {
  const standardTime = dayjs(`${year}-${month}-01`);
  const addedTime = standardTime.add(1, 'month');
  const filteredDiaryList = await model.Diary.findAll({
    where: {
      userId,
      depth: depth!,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
    },
    include: [
      {
        model: model.Sentence,
        required: true,
        include: [
          {
            model: model.Emotion,
            required: true,
            where: {
              id: emotionId || null,
            },
          },
        ],
      },
    ],
    order: [['id', 'ASC']],
  });
  return filteredDiaryList;
};

export const countByEmotions = async ({ userId, year, month }: ReadAllAttributes) => {
  const standardTime = dayjs(`${year}-${month}-01`);
  const addedTime = standardTime.add(1, 'month');
  const emotionCount = await model.Diary.findAll({
    attributes: ['Sentence.Emotions.id', [sequelize.fn('count', sequelize.col('Sentence.Emotions.id')), 'count']],
    where: {
      userId,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
    },
    include: [
      {
        model: model.Sentence,
        attributes: [],
        include: [
          {
            model: model.Emotion,
          },
        ],
      },
    ],
    group: ['Sentence.Emotions.id'],
    order: [['Sentence', 'Emotions', 'id', 'asc']],
    raw: true,
  });

  return emotionCount;
};

export const countByDepth = async ({ userId, year, month }: ReadAllAttributes) => {
  const standardTime = dayjs(`${year}-${month}-01`);
  const addedTime = standardTime.add(1, 'month');
  const depthCount = await model.Diary.findAll({
    attributes: ['depth', [sequelize.fn('count', sequelize.col('depth')), 'count']],
    where: {
      userId,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
    },
    group: ['depth'],
    order: [['depth', 'asc']],
  });

  return depthCount;
};

export const readOne = async (id: number) => {
  const diaryInfo = await model.Diary.findOne({
    where: { id },
    include: [
      {
        model: model.Sentence,
        include: [
          {
            model: model.Emotion,
          },
        ],
      },
    ],
  });
  return diaryInfo;
};

// 우선 랜덤으로 넣어주기
export const create = async (body: Diary) => {
  try {
    const createdDiaryTransaction = await model.sequelize.transaction(async (transaction) => {
      body.position = random.getInt(0, 9);
      const diaryInfo = await model.Diary.create(body, { transaction });
      // 글 작성후 새로운 문장 추천을 받기위함
      await model.UsersRecommendedSentences.destroy({ where: { userId: body.userId }, transaction });
      return diaryInfo;
    });
    return createdDiaryTransaction;
  } catch (err) {
    throw err;
  }
};

// 깊이 업데이트 시에 x위치값 재설정 해주기
export const updateOne = async (diary: Diary, body: Diary) => {
  const diaryInfo = await diary.update(body);
  return diaryInfo;
};

// 삭제 시에 x위치값 재설정해주기
export const deleteOne = async (diary: Diary) => {
  await diary.destroy();
  return diary;
};

export const readSameDepthDiary = async (diary: Diary) => {
  const [year, month] = diary.wroteAt.split('-');
  const standardTime = dayjs(`${year}-${month}-01`);
  const addedTime = standardTime.add(1, 'month');
  const sameDepthDiary = await model.Diary.findAll({
    attributes: ['position', [sequelize.fn('count', sequelize.col('position')), 'count']],
    where: {
      userId: diary.userId,
      depth: diary.depth,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
    },
    group: ['position'],
  });
  return sameDepthDiary;
};
