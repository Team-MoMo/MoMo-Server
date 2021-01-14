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

const calculateTime = (year: number, month: number, day?: number) => {
  const standardTime = dayjs(`${year}-${month}-${day || '01'}`);
  const addedTime = day ? standardTime.add(1, 'day') : standardTime.add(1, 'month');
  return { standardTime, addedTime };
};

export const readAll = async (userId: number) => {
  const diaryList = await model.Diary.findAll({
    where: { userId },
    include: [model.Sentence, model.Emotion],
  });
  return diaryList;
};

export const readAllByDepth = async ({ userId, year, month }: ReadAllAttributes) => {
  const { standardTime, addedTime } = calculateTime(year, month);
  const diaryListByDepth = await model.Diary.findAll({
    where: {
      userId,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
    },
    include: [model.Sentence, model.Emotion],
    order: [
      ['depth', 'ASC'],
      ['wroteAt', 'ASC'],
    ],
  });
  return diaryListByDepth;
};

export const readAllByFilter = async ({ userId, year, month, day, emotionId, depth }: ReadAllAttributes) => {
  const { standardTime, addedTime } = calculateTime(year, month, day);

  const filteredDiaryList = await model.Diary.findAll({
    where: {
      userId,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
      [Op.and]: [depth === undefined ? false : { depth }, !!emotionId && { emotionId }],
    },
    include: [model.Sentence, model.Emotion],
    order: [['wroteAt', 'ASC']],
  });
  return filteredDiaryList;
};

export const countByEmotions = async ({ userId, year, month }: ReadAllAttributes) => {
  const { standardTime, addedTime } = calculateTime(year, month);
  const emotionCount = await model.Diary.findAll({
    attributes: ['Emotion.id', [sequelize.fn('count', sequelize.col('Emotion.id')), 'count']],
    where: {
      userId,
      wroteAt: {
        [Op.gte]: standardTime.format(),
        [Op.lt]: addedTime.format(),
      },
    },
    include: [model.Emotion],
    group: ['Emotion.id'],
    order: [['Emotion', 'id', 'asc']],
    raw: true,
  });

  return emotionCount;
};

export const countByDepth = async ({ userId, year, month }: ReadAllAttributes) => {
  const { standardTime, addedTime } = calculateTime(year, month);
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

export const readRecentOne = async (userId: number) => {
  let standardDate = dayjs().set('hour', 0).set('minutes', 0).set('second', 0);

  while (true) {
    let addedDate = standardDate.add(1, 'day');
    const diaryInfo = await model.Diary.findOne({
      where: {
        userId,
        wroteAt: {
          [Op.gte]: standardDate.format(),
          [Op.lt]: addedDate.format(),
        },
      },
      order: [['id', 'DESC']],
    });

    if (!diaryInfo) {
      return standardDate.format();
    }

    standardDate = standardDate.subtract(1, 'day');
    addedDate = addedDate.subtract(1, 'day');
  }
};

export const readOne = async (id: number) => {
  const diaryInfo = await model.Diary.findOne({
    where: { id },
    include: [model.Sentence, model.Emotion],
  });
  return diaryInfo;
};

export const create = async (body: Diary) => {
  try {
    const createdDiaryTransaction = await model.sequelize.transaction(async (transaction) => {
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

export const createRandomPosition = async (diary: Diary) => {
  const [year, month, day] = diary.wroteAt.split('-');
  const { standardTime, addedTime } = calculateTime(parseInt(year), parseInt(month), parseInt(day));
  let randomPosition;

  const beforeDiaryInfo = await model.Diary.findOne({
    where: {
      userId: diary.userId,
      depth: diary.depth,
      wroteAt: {
        [Op.lt]: standardTime.format(),
      },
    },
    order: [['wroteAt', 'DESC']],
  });

  const afterDiaryInfo = await model.Diary.findOne({
    where: {
      userId: diary.userId,
      depth: diary.depth,
      wroteAt: {
        [Op.gte]: addedTime.format(),
      },
    },
    order: [['wroteAt', 'ASC']],
  });

  while (true) {
    randomPosition = random.getInt(0, 9);
    if ([beforeDiaryInfo?.position, afterDiaryInfo?.position].includes(randomPosition)) {
      continue;
    }
    break;
  }

  return randomPosition;
};
