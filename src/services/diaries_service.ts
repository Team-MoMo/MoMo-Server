import model from '../models';
import Diary from '../models/diaries_model';
import { random } from '../utils';
import sequelize, { Op } from 'sequelize';

interface ReadAll {
  userId: number;
  year: number;
  month: number;
  emotionId?: number;
  depth?: number;
}

const checkDateRange = (year: number, month: number) => {
  return month + 1 > 12 ? `${year + 1}-01-01` : `${year}-${month + 1}-01`;
};

export const readAll = async (userId: number) => {
  const diaryList = await model.Diary.findAll({
    where: { userId },
    include: [model.Sentence, model.Emotion],
  });
  return diaryList;
};

export const readAllByDepth = async ({ userId, year, month }: ReadAll) => {
  const diaryListByDepth = await model.Diary.findAll({
    where: {
      userId,
      wroteAt: {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lt]: new Date(checkDateRange(year, month)),
      },
    },
    include: [model.Sentence, model.Emotion],
    order: [
      ['depth', 'ASC'],
      ['id', 'ASC'],
    ],
  });
  return diaryListByDepth;
};

export const readAllByDate = async ({ userId, year, month }: ReadAll) => {
  const diaryListByDate = await model.Diary.findAll({
    where: {
      userId,
      wroteAt: {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lt]: new Date(checkDateRange(year, month)),
      },
    },
    include: [model.Sentence, model.Emotion],
    order: [['id', 'ASC']],
  });
  return diaryListByDate;
};

export const readAllByFilter = async ({ userId, year, month, emotionId, depth }: ReadAll) => {
  const filteredDiaryList = await model.Diary.findAll({
    where: {
      userId,
      emotionId: emotionId!,
      depth: depth!,
      wroteAt: {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lt]: new Date(checkDateRange(year, month)),
      },
    },
    include: [model.Sentence, model.Emotion],
    order: [['id', 'ASC']],
  });
  return filteredDiaryList;
};

export const countByEmotions = async ({ userId, year, month }: ReadAll) => {
  const emotionCount = await model.Diary.findAll({
    attributes: ['emotionId', [sequelize.fn('count', sequelize.col('emotionId')), 'count']],
    where: {
      userId,
      wroteAt: {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lt]: new Date(checkDateRange(year, month)),
      },
    },
    include: [model.Emotion],
    group: ['emotionId'],
    order: [['emotionId', 'asc']],
  });

  return emotionCount;
};

export const countByDepth = async ({ userId, year, month }: ReadAll) => {
  const depthCount = await model.Diary.findAll({
    attributes: ['depth', [sequelize.fn('count', sequelize.col('depth')), 'count']],
    where: {
      userId,
      wroteAt: {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lt]: new Date(checkDateRange(year, month)),
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
    include: [model.Sentence, model.Emotion],
  });
  return diaryInfo;
};

// 우선 랜덤으로 넣어주기
export const create = async (body: Diary) => {
  body.position = random.getInt(0, 9);
  const diaryInfo = await model.Diary.create(body);
  return diaryInfo;
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
  const sameDepthDiary = await model.Diary.findAll({
    attributes: ['position', [sequelize.fn('count', sequelize.col('position')), 'count']],
    where: {
      userId: diary.userId,
      depth: diary.depth,
      wroteAt: {
        [Op.gte]: new Date(`${year}-${month}-01`),
        [Op.lt]: new Date(checkDateRange(parseInt(year), parseInt(month))),
      },
    },
    group: ['position'],
  });
  return sameDepthDiary;
};
