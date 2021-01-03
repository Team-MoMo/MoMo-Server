import { statusCode, authUtil, resMessage } from '../utils';
import express, { Request, Response, NextFunction, Send } from 'express';
import { sentencesService } from '../services';
import Sentence from '../models/sentences_model';

export const readAll = async (req: Request, res: Response) => {
  const { emotion, user }: any = req.query;
  let recommendSentences: Sentence[];

  if (!emotion || !user) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  } else {
    const userRecommendSentenceIds: number[] = await sentencesService.readAllUsersRecommendSentences(emotion, user);
    if (userRecommendSentenceIds.length > 0) {
      console.log('userRecommendSentenceIds.length > 0');
      recommendSentences = await sentencesService.readAllNInUserRecommendSentences(userRecommendSentenceIds);
      return res
        .status(statusCode.OK)
        .json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), recommendSentences));
    } else {
      const userSentences: number[] = await sentencesService.readAllDiaries(emotion, user);
      recommendSentences = await sentencesService.readAllNotInUserSentences(emotion, userSentences);
      await sentencesService.createUsersRecommendSentences(user, recommendSentences);

      return res
        .status(statusCode.OK)
        .json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), recommendSentences));
    }
  }
};
