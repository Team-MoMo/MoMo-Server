import { statusCode, authUtil, resMessage } from '../utils';
import express, { Request, Response, NextFunction, Send } from 'express';
import { sentencesService } from '../services';

export const readAll = async (req: Request, res: Response) => {
  const { emotion, user }: any = req.query;
  let usersRecommendSentences: object[];

  if (!emotion || !user) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  } else {
    usersRecommendSentences = await sentencesService.readAllUsersRecommendSentences(emotion, user);
    console.log(usersRecommendSentences);
    if (usersRecommendSentences.length > 0) {
      console.log('usersRecommendSentences');
      return res
        .status(statusCode.OK)
        .json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), usersRecommendSentences));
    } else {
      const userSentences: number[] = await sentencesService.readAllDiaries(emotion, user);
      usersRecommendSentences = await sentencesService.readAll(emotion, userSentences);

      console.log(userSentences);
      console.log('usersSentences');
      return res
        .status(statusCode.OK)
        .json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), usersRecommendSentences));
    }
  }
};
