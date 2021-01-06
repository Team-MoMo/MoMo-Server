import { statusCode, authUtil, resMessage } from '../utils';
import { Request, Response } from 'express';
import { usersService } from '../services';
import { sentencesService } from '../services';
import Sentence from '../models/sentences_model';
import dayjs from 'dayjs';

export const readAll = async (req: Request, res: Response) => {
  const { emotion, user }: { emotion?: string; user?: string } = req.query;

  const emotionId = parseInt(emotion!);
  const userId = parseInt(user!);

  let recommendSentences: Sentence[];

  if (!emotion || !user) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }

  try {
    const userInfo = await usersService.readOne(userId);
    if(!userInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
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
    emotionId,
    userId,
    date
  );

  if (userRecommendSentenceIds.length > 0) {
    recommendSentences = await sentencesService.readAllInUserRecommendSentences(userRecommendSentenceIds);
    return res
      .status(statusCode.OK)
      .json(authUtil.successTrue(resMessage.X_READ_SUCCESS('문장'), recommendSentences));
  }

  const userSentences: number[] = await sentencesService.readAllDiaries(emotionId, userId, before30Day);
  const userRecommendedSentences: number[] = await sentencesService.readAllUsersRecommendSentences(emotionId, userId);
  const cannotRecommendSentence: number[] = userSentences.concat(userRecommendedSentences);

  recommendSentences = await sentencesService.readAllNotInUserSentences(emotionId, cannotRecommendSentence);
  await sentencesService.createUsersRecommendSentences(userId, recommendSentences);

  return res
    .status(statusCode.OK)
    .json(authUtil.successTrue(resMessage.X_READ_SUCCESS('문장'), recommendSentences));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_FAIL('문장')));
  }
  
};
