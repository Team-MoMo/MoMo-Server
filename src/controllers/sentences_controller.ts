import { statusCode, authUtil, resMessage } from '../utils';
import express, { Request, Response, NextFunction, Send } from 'express';
import { sentencesService } from '../services';
import { QueryTypes } from 'sequelize/types';
import dayjs from 'dayjs';

export const readAll = async (req: Request, res: Response) => {
  const { emotion, user }: any = req.query;
  if (!emotion || !user) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  } else {
    const usersRecommendSentences: object = await sentencesService.readAllUsersRecommendSentences(emotion, user);
    if (usersRecommendSentences) {
      return res
        .status(statusCode.OK)
        .json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), usersRecommendSentences));
    }
    const today: any = dayjs();
    // const userDiarySentences: object = await sentencesService.readAllDiaries(emotion, user, today);
    const sentences: object = await sentencesService.readAll(emotion, user);

    console.log(emotion);
    console.log(user);
  }

  try {
    const sentences: object = await sentencesService.readAll(emotion, user);
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), sentences));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_ALL_FAIL('문장')));
  }
};
