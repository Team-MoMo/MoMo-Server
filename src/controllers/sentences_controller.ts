import { statusCode, resJson, resMessage } from '../utils';
import { Request, Response } from 'express';
import { usersService } from '../services';
import { sentencesService } from '../services';
import Sentence from '../models/sentences_model';
import dayjs from 'dayjs';

const USER = '회원';
const SENTENCE = '문장';

export const readAll = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { emotionId, userId }: { emotionId?: number; userId?: number } = req.query;

  if (userId != decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  let recommendSentenceList: Sentence[];

  try {
    const userInfo = await usersService.readOne(userId!);
    if (!userInfo) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
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
      emotionId!,
      userId!,
      date
    );

    if (userRecommendSentenceIds.length > 0) {
      recommendSentenceList = await sentencesService.readAllInUserRecommendSentences(userRecommendSentenceIds);
      return res
        .status(statusCode.OK)
        .json(resJson.success(resMessage.X_READ_SUCCESS(SENTENCE), recommendSentenceList));
    }

    const userSentences: number[] = await sentencesService.readAllDiaries(emotionId!, userId!, before30Day);
    const userRecommendedSentences: number[] = await sentencesService.readAllUsersRecommendSentences(
      emotionId!,
      userId!
    );
    const cannotRecommendSentence: number[] = userSentences.concat(userRecommendedSentences);

    recommendSentenceList = await sentencesService.readAllNotInUserSentences(emotionId!, cannotRecommendSentence);
    await sentencesService.createUsersRecommendSentences(userId!, recommendSentenceList);

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_READ_SUCCESS(SENTENCE), recommendSentenceList));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_READ_FAIL(SENTENCE)));
  }
};

export const create = async (req: Request, res: Response) => {
  const { emotion } = req.body;

  try {
    const emotionIds = await sentencesService.readAllEmotionIds(emotion);
    const sentenceInfo = await sentencesService.create(req.body, emotionIds);

    return res.status(statusCode.CREATED).json(resJson.success(resMessage.X_CREATE_SUCCESS(SENTENCE), sentenceInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_CREATE_FAIL(SENTENCE), err));
  }
};
