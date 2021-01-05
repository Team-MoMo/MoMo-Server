import { statusCode, authUtil, resMessage } from '../utils';
import { Request, Response } from 'express';
import { sentencesService } from '../services';
import Sentence from '../models/sentences_model';
import dayjs from 'dayjs';

export const readAll = async (req: Request, res: Response) => {
  const { emotion, user }: { emotion?: number; user?: number } = req.query;

  let recommendSentences: Sentence[];

  if (!emotion || !user) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  const now = dayjs(new Date());
  const before30Day = now.subtract(30, 'day');
  let date;
  if (now.get('hour') > 5) {
    date = now.set('hour', 6).set('minute', 0).set('second', 0).set('millisecond', 0);
  } else {
    date = now.subtract(1, 'day').set('hour', 6).set('minute', 0).set('second', 0).set('millisecond', 0);
  }

  const userRecommendSentenceIds: number[] = await sentencesService.readAllUsersRecommendSentencesAfter6(
    emotion,
    user,
    date
  );

  if (userRecommendSentenceIds.length > 0) {
    recommendSentences = await sentencesService.readAllInUserRecommendSentences(userRecommendSentenceIds);
    return res
      .status(statusCode.OK)
      .json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), recommendSentences));
  }

  const userSentences: number[] = await sentencesService.readAllDiaries(emotion, user, before30Day);
  const userRecommendedSentences: number[] = await sentencesService.readAllUsersRecommendSentences(emotion, user);
  const cannotRecommendSentence: number[] = userSentences.concat(userRecommendedSentences);

  recommendSentences = await sentencesService.readAllNotInUserSentences(emotion, cannotRecommendSentence);
  await sentencesService.createUsersRecommendSentences(user, recommendSentences);

  return res
    .status(statusCode.OK)
    .json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), recommendSentences));
};
