import crypto from 'crypto';
import { statusCode, authUtil, resMessage } from '../utils';
import express, { Request, Response, NextFunction, Send } from 'express';
import { usersService } from '../services';

export const signup = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const signupByApple = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const signupByKakao = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const signin = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const readAll = async (req: Request, res: Response) => {
  try {
    const users = await usersService.readAll();
    res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('회원'), users));
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_ALL_FAIL('회원')));
  }
};

export const readOne = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await usersService.readOne(id);
    if (user) {
      res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_SUCCESS('회원'), user));
    } else {
      res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
    }
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_FAIL('회원')));
  }
};

export const updateAlarm = async (req: Request, res: Response) => {
  //view나오는 거 보고 isAlarmSet 어떻게 할지 변경 예정!
  const { id } = req.params;
  const { alarmTime } = req.body;
  if (!id) {
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    await usersService.updateAlarm(id, alarmTime);
    res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_UPDATE_SUCCESS('알람')));
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_UPDATE_FAIL('알람')));
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  //view에 따라 변경 가능성있음
  //회원가입 알고리즘에 따라 변경 가능성있음
  const { id } = req.params;
  const { password, newPassword } = req.body;

  if (!id || !password || !newPassword) {
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const user = await usersService.readOne(id);
    console.log(user?.passwordSalt);
    if (user) {
      const inputPassword = crypto.pbkdf2Sync(password, user.passwordSalt, 10000, 64, 'sha512').toString('base64');

      if (user.password == inputPassword) {
        await usersService.updatePassword(id, newPassword);
        return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_UPDATE_SUCCESS('비밀번호')));
      } else {
        return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.MISS_MATCH_PASSWORD));
      }
    }
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_UPDATE_FAIL('비밀번호')));
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  } else {
    try {
      const user = await usersService.readOne(id);
      if (user) {
        await usersService.deleteOne(id);
        res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_DELETE_SUCCESS('회원')));
      }
    } catch (err) {
      console.log('error');
      console.log(err);
      res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_DELETE_FAIL('회원')));
    }
  }
};
