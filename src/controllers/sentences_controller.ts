import { statusCode, authUtil, resMessage } from '../utils';
import express, { Request, Response, NextFunction, Send } from 'express';
import { sentencesService } from '../services';

export const readAll = async (req: Request, res: Response) => {
  try {
    const sentences = await sentencesService.readAll();
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_ALL_FAIL('문장'), sentences));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_ALL_FAIL('문장')));
  }
};
