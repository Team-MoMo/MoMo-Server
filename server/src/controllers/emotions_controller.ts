import { statusCode, resJson, resMessage } from '../utils';
import { Request, Response } from 'express';
import { emotionsService } from '../services';
import Emotion from '../models/emotions_model';

const EMOTION = '감정';

export const readAll = async (req: Request, res: Response) => {
  try {
    const emotionList: Emotion[] = await emotionsService.readAll();
    return res.status(statusCode.OK).json(resJson.success(resMessage.X_READ_ALL_SUCCESS(EMOTION), emotionList));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(resJson.fail(resMessage.X_READ_ALL_FAIL(EMOTION), err));
  }
};
