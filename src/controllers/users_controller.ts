import crypto from 'crypto';
import { statusCode, authUtil } from '../utils';
import resMessage from '../utils/resMessage';
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
  const id = req.params;
  if (!id) {
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
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

export const updateInfo = async (req: Request, res: Response) => {
  const id = req.params;
  const name = req.body;
  const alarmTime = req.body;
  //다른거 더 변경할게 있나..?
  if (!id || (!name && !alarmTime)) {
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    //readOne으로 id가 존재하는 id인지 체크를 해줘야할까
    const user = await usersService.readOne(id);
    if (user) {
      const userInfoChange = await usersService.updateInfo(id, name, alarmTime);
      res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_UPDATE_SUCCESS('회원정보')));
    } else {
      res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
    }
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_UPDATE_FAIL('회원정보')));
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const id = req.params;
  const password = req.body;
  const newPassword = req.body;

  if (!id || !password || !newPassword) {
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const user = await usersService.readOne(id);
    if (user) {
      const inputPassword = crypto.pbkdf2Sync(password, user.passwordSalt, 10000, 64, 'sha512').toString('base64');

      if (user.password == inputPassword) {
        const passwordChange = await usersService.updatePassword(id, newPassword);
        return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_UPDATE_SUCCESS('비밀번호')));
      } else {
        return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.MISS_MATCH_PASSWORD));
      }
    } else {
      res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
    }
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_UPDATE_FAIL('비밀번호')));
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const id = req.params;
  if (!id) {
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const user = await usersService.readOne(id);
    if (user) {
      const deleteUser = await usersService.deleteOne(id);
      res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_DELETE_SUCCESS('회원')));
    }
    res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
  } catch (err) {
    res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_DELETE_FAIL('회원')));
  }
};
