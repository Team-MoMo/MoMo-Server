import { statusCode, authUtil, resMessage } from '../utils';
import express, { Request, Response, NextFunction, Send } from 'express';
import { emotionsService } from '../services';

export const readAll = async (req: Request, res: Response) => {
  try {
    const emotions = await emotionsService.readAll();
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('감정'), emotions));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).send(authUtil.successFalse(resMessage.X_READ_ALL_FAIL('감정')));
  }
};
