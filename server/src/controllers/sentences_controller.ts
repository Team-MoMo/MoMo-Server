import { statusCode, resJson, resMessage } from '../utils';
import { Request, Response } from 'express';
import { usersService } from '../services';
import { sentencesService } from '../services';
import Sentence from '../models/sentences_model';
import { onboardingSentences } from '../utils/onboarding_sentences';
import dayjs from 'dayjs';

const USER = '회원';
const SENTENCE = '문장';
const ONBOARDING = '온보딩';
const BLIND = '블라인드';
const RECOMMEND = '추천';

interface SentenceAttributes {
  sentenceId?: number;
  bookName?: string;
  publisher?: string;
  writer?: string;
  blindedAt?: string;
}

export const readAll = async (req: Request, res: Response) => {
  const { sentenceId, bookName, publisher, writer }: SentenceAttributes = req.query;

  if (!sentenceId && !publisher && !writer && !bookName) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  const readOption = { sentenceId: sentenceId!, bookName: bookName!, publisher: publisher!, writer: writer! };

  try {
    const sentenceInfo: Sentence[] = await sentencesService.readAll(readOption);
    if (!sentenceInfo[0]) {
      return res.status(statusCode.OK).json(resJson.success(resMessage.NO_X(SENTENCE)));
    }
    return res.status(statusCode.OK).json(resJson.success(resMessage.X_READ_SUCCESS(SENTENCE), sentenceInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_READ_FAIL(SENTENCE), err));
  }
};

export const readRecommendedSentences = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { emotionId, userId }: { emotionId?: number; userId?: number } = req.query;

  if (userId !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  let recommendSentenceList: Sentence[];

  try {
    const userInfo = await usersService.readOne(userId!);
    if (!userInfo) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    const now = dayjs().add(9, 'hour');
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
        .json(resJson.success(resMessage.X_READ_SUCCESS(RECOMMEND + SENTENCE), recommendSentenceList));
    }

    const userSentences: number[] = await sentencesService.readAllDiaries(emotionId!, userId!, before30Day);
    const userRecommendedSentences: number[] = await sentencesService.readAllUsersRecommendSentences(userId!);
    const cannotRecommendSentence: number[] = userSentences.concat(userRecommendedSentences);

    recommendSentenceList = await sentencesService.readAllNotInUserSentences(emotionId!, cannotRecommendSentence);
    if (!recommendSentenceList[0]) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.SENTENCES_NOT_EXIST));
    }
    await sentencesService.createUsersRecommendSentences(userId!, emotionId!, recommendSentenceList);
    return res
      .status(statusCode.OK)
      .json(resJson.success(resMessage.X_READ_SUCCESS(RECOMMEND + SENTENCE), recommendSentenceList));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(resJson.fail(resMessage.X_READ_FAIL(RECOMMEND + SENTENCE), err));
  }
};

export const readAllOnboarding = async (req: Request, res: Response) => {
  const { emotionId }: { emotionId?: number } = req.query;

  const onboardingSentenceInfo: object[] = onboardingSentences.filter((item) => {
    return item.emotionId === emotionId;
  });

  return res
    .status(statusCode.OK)
    .json(resJson.success(resMessage.X_READ_SUCCESS(ONBOARDING + SENTENCE), onboardingSentenceInfo[0]));
};

export const create = async (req: Request, res: Response) => {
  const { emotion } = req.body;

  try {
    const emotionIds = await sentencesService.readAllEmotionIds(emotion);
    const createdSentenceInfo = await sentencesService.create(req.body, emotionIds);

    return res
      .status(statusCode.CREATED)
      .json(resJson.success(resMessage.X_CREATE_SUCCESS(SENTENCE), createdSentenceInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_CREATE_FAIL(SENTENCE), err));
  }
};

export const updateBlindedAt = async (req: Request, res: Response) => {
  const { sentenceId, bookName, publisher, writer, blindedAt }: SentenceAttributes = req.body;

  if (!sentenceId && !publisher && !writer && !bookName) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  const readOption = { sentenceId: sentenceId!, bookName: bookName!, publisher: publisher!, writer: writer! };

  try {
    const sentenceInfo: Sentence[] = await sentencesService.readAll(readOption);
    if (!sentenceInfo[0]) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(SENTENCE)));
    }
    const updatedSentenceInfo = await sentencesService.updateBlindedAt(sentenceInfo, blindedAt);

    return res
      .status(statusCode.OK)
      .json(resJson.success(resMessage.X_UPDATE_SUCCESS(SENTENCE + BLIND), updatedSentenceInfo));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(resJson.fail(resMessage.X_UPDATE_FAIL(SENTENCE + BLIND), err));
  }
};

export const deleteAll = async (req: Request, res: Response) => {
  const { sentenceId, bookName, publisher, writer }: SentenceAttributes = req.body;

  if (!sentenceId && !publisher && !writer && !bookName) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  const readOption = { sentenceId: sentenceId!, bookName: bookName!, publisher: publisher!, writer: writer! };

  try {
    const sentenceInfo: Sentence[] = await sentencesService.readAll(readOption);
    if (!sentenceInfo[0]) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(SENTENCE)));
    }
    await sentencesService.deleteAll(sentenceInfo);
    return res.status(statusCode.OK).json(resJson.success(resMessage.X_DELETE_SUCCESS(SENTENCE), sentenceInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_DELETE_FAIL(SENTENCE), err));
  }
};

export const deleteAllYesterday = async (req: Request, res: Response) => {
  try {
    const today = dayjs(new Date()).add(9, 'hour');
    const yesterday = today.subtract(1, 'day').set('hour', 6).set('minute', 0).set('second', 0);
    const yesterdaySentences = await sentencesService.readAllYesterday(yesterday);
    await sentencesService.deleteAllYesterday(yesterdaySentences!);
    return res.status(statusCode.OK).json(resJson.success(resMessage.X_DELETE_SUCCESS(RECOMMEND + SENTENCE)));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(resJson.fail(resMessage.X_DELETE_FAIL(RECOMMEND + SENTENCE), err));
  }
};
