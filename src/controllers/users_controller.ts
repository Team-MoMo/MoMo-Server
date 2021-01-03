import util from '../utils/authUtil';
import { jwt } from '../utils';
import crypto from 'crypto';
import resMessage from '../utils/resMessage';
import express, { Request, Response, NextFunction, Send } from 'express';
import { usersService } from '../services';
import { statusCode } from '../utils';

export const signup = async (req: Request, res: Response) => {
  const { email, password, name }: { email: string; password: string; name: string } = req.body;

  if (!email || !password || !name) {
    return res.status(statusCode.BAD_REQUEST).json(util.successFalse(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOneByEmail(email);
    if (user) {
      return res.status(statusCode.BAD_REQUEST).json(util.successFalse(resMessage.DUPLICATE_ID));
    }

    const newUser = await usersService.signup(email, password, name);
    const { token } = jwt.sign(newUser);
    newUser.password = '';
    newUser.passwordSalt = '';

    return res.status(statusCode.OK).json(util.successTrue(resMessage.SIGN_UP_SUCCESS, { user: newUser, token }));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(util.successFalse(resMessage.SIGN_UP_FAIL));
  }
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
  const { email, password }: { email: string; password: string } = req.body;

  if (!email || !password) {
    return res.status(statusCode.BAD_REQUEST).json(util.successFalse(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOneByEmail(email);
    if (user == null) {
      return res.status(statusCode.BAD_REQUEST).json(util.successFalse(resMessage.MISS_MATCH_USER_INFO));
    }

    if (!usersService.signin(user, password)) {
      return res.status(statusCode.BAD_REQUEST).json(util.successFalse(resMessage.MISS_MATCH_USER_INFO));
    }

    const { token } = jwt.sign(user);
    user.password = '';
    user.passwordSalt = '';

    return res.status(statusCode.OK).json(util.successTrue(resMessage.SIGN_IN_SUCCESS, { user, token }));
  } catch (error) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(util.successFalse(resMessage.SIGN_IN_FAIL));
  }
};

export const readAll = async (req: Request, res: Response) => {
  try {
    await usersService.readAll(); //라우팅 테스트용
    res.send('result'); //라우팅 테스트용
  } catch (err) {}
};

export const readOne = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const updateInfo = async (req: Request, res: Response) => {
  try {
  } catch (err) {}
};

export const updatePassword = async (req: Request, res: Response) => {
  try {
  } catch (err) {}
};

export const deleteOne = async (req: Request, res: Response) => {
  try {
  } catch (err) {}
};
