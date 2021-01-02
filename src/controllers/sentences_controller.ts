import { statusCode, authUtil, resMessage } from '../utils';
import express, { Request, Response, NextFunction, Send } from 'express';
import { sentencesService } from '../services';
import { QueryTypes } from 'sequelize/types';

export const readAll = async (req: Request, res: Response) => {
  try {
    const emotion: any = req.query.emotion;
    const sentences: object = await sentencesService.readAll(emotion);
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('문장'), sentences));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_ALL_FAIL('문장')));
  }
};
