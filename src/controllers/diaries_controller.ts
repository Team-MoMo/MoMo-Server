import { Request, Response } from 'express';
import { diariesService } from '../services';
import { authUtil, resMessage, statusCode } from '../utils';
import Diary from '../models/diaries_model';

const DIARY = '일기';

interface ReadAll {
  order?: string;
  userId?: string;
  emotionId?: string;
  depth?: string;
  year?: string;
  month?: string;
}

export const readAll = async (req: Request, res: Response) => {
  const { order, userId, emotionId, depth, year, month }: ReadAll = req.query;
  let diaryList: Diary[];
  if (!userId || !year || !month || (order === 'filter' && (!emotionId || !depth))) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }

  const findOption = {
    userId: parseInt(userId),
    year: parseInt(year),
    month: parseInt(month),
    emotionId: emotionId ? parseInt(emotionId) : undefined,
    depth: depth ? parseInt(depth) : undefined,
  };

  try {
    if (order === 'depth') {
      diaryList = await diariesService.readAllByDepth(findOption);
    } else if (order === 'date') {
      diaryList = await diariesService.readAllByDate(findOption);
    } else if (order === 'filter') {
      diaryList = await diariesService.readAllByFilter(findOption);
    } else {
      diaryList = await diariesService.readAll(parseInt(userId));
    }

    if (!diaryList) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.BODY_VALUE_ERROR));
    }
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS(DIARY), diaryList));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(authUtil.successFalse(resMessage.X_READ_ALL_FAIL(DIARY), err));
  }
};

export const readStatistics = async (req: Request, res: Response) => {
  const { year, month, userId }: { year?: string; month?: string; userId?: string } = req.query;

  if (!year || !month || !userId) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }

  const findOption = {
    userId: parseInt(userId),
    year: parseInt(year),
    month: parseInt(month),
  };

  try {
    const emotionCounts = await diariesService.countByEmotions(findOption);
    const depthCounts = await diariesService.countByDepth(findOption);
    if (!emotionCounts || !depthCounts) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.BODY_VALUE_ERROR));
    }
    return res
      .status(statusCode.OK)
      .json(authUtil.successTrue(resMessage.X_READ_SUCCESS(`${DIARY}통계`), { emotionCounts, depthCounts }));
  } catch (err) {
    console.error(err);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(authUtil.successFalse(resMessage.X_READ_FAIL(`${DIARY}통계`), err));
  }
};

export const readOne = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  if (!id) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const diaryInfo = await diariesService.readOne(id);
    if (!diaryInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('diary')));
    }
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_SUCCESS(DIARY), diaryInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_FAIL(DIARY), err));
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const diaryInfo = await diariesService.create(req.body);
    return res.status(statusCode.CREATED).json(authUtil.successTrue(resMessage.X_CREATE_SUCCESS(DIARY), diaryInfo));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(authUtil.successFalse(resMessage.X_CREATE_FAIL(DIARY), err));
  }
};

export const updateOne = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  if (!id) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const diaryInfo = await diariesService.readOne(id);
    if (!diaryInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X(DIARY)));
    }
    const updatedDiaryInfo = await diariesService.updateOne(diaryInfo, req.body);
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_UPDATE_SUCCESS(DIARY), updatedDiaryInfo));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(authUtil.successFalse(resMessage.X_UPDATE_FAIL(DIARY), err));
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  if (!id) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const diaryInfo = await diariesService.readOne(id);
    if (!diaryInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X(DIARY)));
    }
    const deletedDiaryInfo = await diariesService.deleteOne(diaryInfo);
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_DELETE_SUCCESS(DIARY), deletedDiaryInfo));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(authUtil.successFalse(resMessage.X_DELETE_FAIL(DIARY), err));
  }
};
