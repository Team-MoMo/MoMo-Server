import { statusCode, authUtil, resMessage } from '../utils';
import { Request, Response } from 'express';
import { sentencesService } from '../services';
import Sentence from '../models/sentences_model';
import dayjs from 'dayjs';
import { stat } from 'fs';

export const readAll = async (req: Request, res: Response) => {
  const { emotion, user } = req.query;
  let recommendSentences: Sentence[];

  if (!emotion || !user) {
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  } else {
    const now = dayjs(new Date());
    let date;

    if (now.get('hour') > 5) {
      date = now.set('hour', 6).set('minute', 0).set('second', 0).set('millisecond', 0);
    } else {
      date = now.subtract(1, 'day').set('hour', 6).set('minute', 0).set('second', 0).set('millisecond', 0);
    }
    try {
      const userRecommendSentenceIds: number[] = await sentencesService.readAllUsersRecommendedSentences(
        emotion,
        user,
        date
      );

      if (userRecommendSentenceIds.length > 0) {
        console.log('userRecomendSentenceIds 있음');

        recommendSentences = await sentencesService.readAllInUserRecommendSentenceIds(userRecommendSentenceIds);
      } else {
        console.log('userRecomendSentenceIds 없음');

        const before30Day = now.subtract(30, 'day');
        const userSentences: number[] = await sentencesService.readAllDiaries(emotion, user, before30Day);
        recommendSentences = await sentencesService.readAllNotInUserSentences(emotion, userSentences);
        await sentencesService.createUsersRecommendSentences(user, recommendSentences);
      }
      res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), recommendSentences));
    } catch (err) {
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_ALL_FAIL('문장')));
    }
  }
};
