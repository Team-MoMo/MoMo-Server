import { Request, Response } from 'express';
import { diariesService, usersService } from '../services';
import { emailUtil, resJson, resMessage, statusCode } from '../utils';
import Diary from '../models/diaries_model';
import * as json2scv from 'json2csv';
import { createTransport } from 'nodemailer';
import dayjs from 'dayjs';

const DIARY = '일기';
interface ReadAllAttributes {
  order?: string;
  userId?: number;
  emotionId?: number;
  depth?: number;
  year?: number;
  month?: number;
  day?: number;
}

export const readAll = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { order, userId, emotionId, depth, year, month, day }: ReadAllAttributes = req.query;

  if (userId !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  let diaryList: Diary[];
  const findOption = { userId: userId!, year: year!, month: month!, day, emotionId, depth };

  try {
    if (order === 'depth') {
      diaryList = await diariesService.readAllByDepth(findOption);
    } else if (order === 'filter') {
      diaryList = await diariesService.readAllByFilter(findOption);
    } else {
      diaryList = await diariesService.readAll(userId!);
    }

    if (!diaryList) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.BODY_VALUE_ERROR));
    }
    return res.status(statusCode.OK).json(resJson.success(resMessage.X_READ_ALL_SUCCESS(DIARY), diaryList));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_READ_ALL_FAIL(DIARY), err));
  }
};

export const readRecentOne = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { userId }: { userId?: number } = req.query;

  if (userId !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  try {
    const recentDiaryInfo = await diariesService.readRecentOne(userId!);

    return res
      .status(statusCode.OK)
      .json(resJson.success(resMessage.X_READ_SUCCESS(`${DIARY} 최근 미작성 날짜`), recentDiaryInfo));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(resJson.fail(resMessage.X_READ_FAIL(`${DIARY} 최근 미작성 날짜`), err));
  }
};

export const readStatistics = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { year, month, userId }: { year?: number; month?: number; userId?: number } = req.query;

  if (userId !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  const findOption = { userId: userId!, year: year!, month: month! };

  try {
    const emotionCounts = await diariesService.countByEmotions(findOption);
    const depthCounts = await diariesService.countByDepth(findOption);
    if (!emotionCounts || !depthCounts) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.BODY_VALUE_ERROR));
    }
    return res
      .status(statusCode.OK)
      .json(resJson.success(resMessage.X_READ_SUCCESS(`${DIARY}통계`), { emotionCounts, depthCounts }));
  } catch (err) {
    console.error(err);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_READ_FAIL(`${DIARY}통계`), err));
  }
};

export const readOne = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { id }: { id?: number } = req.params;

  try {
    const diaryInfo = await diariesService.readOne(id!);
    if (!diaryInfo) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(DIARY)));
    }

    if (diaryInfo.userId !== decodedUserId) {
      return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
    }

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_READ_SUCCESS(DIARY), diaryInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_READ_FAIL(DIARY), err));
  }
};

export const create = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { userId }: { userId?: number } = req.body;

  if (userId !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  try {
    req.body.position = await diariesService.createRandomPosition(req.body);
    const diaryInfo = await diariesService.create(req.body);

    return res.status(statusCode.CREATED).json(resJson.success(resMessage.X_CREATE_SUCCESS(DIARY), diaryInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_CREATE_FAIL(DIARY), err));
  }
};

export const updateOne = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { id }: { id?: number } = req.params;

  try {
    const diaryInfo = await diariesService.readOne(id!);
    if (!diaryInfo) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(DIARY)));
    }

    if (diaryInfo.userId !== decodedUserId) {
      return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
    }

    req.body.wroteAt &&
      (req.body.position = await diariesService.createRandomPosition({ userId: decodedUserId, ...req.body }));
    const updatedDiaryInfo = await diariesService.updateOne(diaryInfo, req.body);

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_UPDATE_SUCCESS(DIARY), updatedDiaryInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_UPDATE_FAIL(DIARY), err));
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { id }: { id?: number } = req.params;

  try {
    const diaryInfo = await diariesService.readOne(id!);
    if (!diaryInfo) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(DIARY)));
    }

    if (diaryInfo.userId !== decodedUserId) {
      return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
    }

    const deletedDiaryInfo = await diariesService.deleteOne(diaryInfo);
    return res.status(statusCode.OK).json(resJson.success(resMessage.X_DELETE_SUCCESS(DIARY), deletedDiaryInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_DELETE_FAIL(DIARY), err));
  }
};

export const exportUserDiaries = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { userId, email }: { userId?: number; email?: string } = req.body;

  if (userId === undefined || decodedUserId === undefined || email === undefined) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X('USER_ID_OR_EMAIL')));
  }

  if (userId !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  try {
    const user = await usersService.readOne(userId);

    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X('유저')));
    }

    const now = dayjs();

    if (user.exportationCount >= 2 && (user.exportedAt === null || dayjs(user.exportedAt).isSame(now, 'day'))) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.success('일일 전송 횟수를 초과했습니다.'));
    }

    const diaries = await diariesService.readAll(userId);

    if (diaries.length === 0) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.success(resMessage.NO_X(DIARY)));
    }

    const exportDiaries = diaries.map((diary) => {
      return {
        contents: diary.contents,
        wroteAt: diary.wroteAt,
        sentense: diary.Sentence.contents,
        sentenseBookName: diary.Sentence.bookName,
        sentensePublisher: diary.Sentence.publisher,
        sentenseWriter: diary.Sentence.writer,
        emotion: diary.Emotion.name,
      };
    });

    const fields = [
      { value: 'contents', label: '일기 내용' },
      { value: 'wroteAt', label: '작성 일자' },
      { value: 'sentense', label: '책 문장' },
      { value: 'sentenseBookName', label: '책 이름' },
      { value: 'sentensePublisher', label: '출판사' },
      { value: 'sentenseWriter', label: '작가' },
      { value: 'emotion', label: '감정' },
    ];

    const csv = json2scv.parse(exportDiaries, { fields });
    const csvBuffer = Buffer.from(csv, 'utf-8');

    const mailOptions = {
      from: 'momoisdiary@gmail.com',
      to: email,
      subject: 'MoMo 일기 CSV파일입니다.',
      attachments: [
        {
          filename: '모모일기.csv',
          content: csvBuffer,
        },
      ],
    };

    const exportationCount = (() => {
      if (user.exportationCount === 2) {
        return 0;
      }

      if (!dayjs(user.exportedAt).isSame(now, 'day') && user.exportationCount > 1) {
        return 1;
      }

      return user.exportationCount + 1;
    })();

    await emailUtil.transporter.sendMail(mailOptions);
    await usersService.updateExportedAt(user, now.toDate(), exportationCount);

    return res.status(statusCode.OK).json(resJson.success('일기 전송 성공'));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail('일기 전송 실패', err));
  }
};
