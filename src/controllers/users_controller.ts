import { statusCode, jwt, authUtil, emailUtil,resMessage } from '../utils';
import { Request, Response } from 'express';
import { usersService } from '../services';

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOneByEmail(email);
    if (user) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.DUPLICATE_ID));
    }

    const newUser = await usersService.create(email, name, password);
    const { token } = jwt.sign(newUser);
    newUser.password = '';
    newUser.passwordSalt = '';

    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.SIGN_UP_SUCCESS, { user: newUser, token }));
  } catch (err) {
    console.log(err);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.SIGN_UP_FAIL));
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
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOneByEmail(email);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('이메일')));
    }

    if (!usersService.checkPassword(user, password)) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.MISS_MATCH_USER_INFO));
    }

    const { token } = jwt.sign(user);
    user.password = '';
    user.passwordSalt = '';

    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.SIGN_IN_SUCCESS, { user, token }));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.SIGN_IN_FAIL));
  }
};

export const readAll = async (req: Request, res: Response) => {
  try {
    const users = await usersService.readAll();
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_ALL_SUCCESS('회원'), users));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_ALL_FAIL('회원')));
  }
};

export const readOne = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  if (!id) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const userInfo = await usersService.readOne(id);
    if (!userInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
    }
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_READ_SUCCESS('회원'), userInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_READ_FAIL('회원')));
  }
};

export const updateAlarm = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  const { isAlarmSet, alarmTime } = req.body;

  if (!id || !isAlarmSet) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const userInfo = await usersService.readOne(id);
    if (!userInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
    }

    let userAlarmInfo;
    if (!alarmTime) {
      userAlarmInfo = await usersService.updateAlarmSet(id, isAlarmSet);
    } else {
      userAlarmInfo = await usersService.updateAlarmTime(id, isAlarmSet, alarmTime);
    }
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_UPDATE_SUCCESS('알람'), userAlarmInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_UPDATE_FAIL('알람')));
  }
};

export const checkPassword = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  const { password } = req.body;

  if (!id || !password) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }

  try {
    const userInfo = await usersService.readOne(id);
    if (!userInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
    }
    const checkPasswordResult = await usersService.checkPassword(userInfo, password);
    if (!checkPasswordResult) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.MISS_MATCH_PASSWORD));
    }
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.MATCH_PASSWORD));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.INTERNAL_SERVER_ERROR));
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  const { newPassword } = req.body;

  if (!id || !newPassword) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const userInfo = await usersService.readOne(id);
    if (!userInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
    }
    await usersService.updatePassword(id, newPassword);
    userInfo.password = '';
    userInfo.passwordSalt = '';
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_UPDATE_SUCCESS('비밀번호'), userInfo));
  } catch (err) {
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(authUtil.successFalse(resMessage.X_UPDATE_FAIL('비밀번호')));
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  if (!id) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }
  try {
    const userInfo = await usersService.readOne(id);
    if (!userInfo) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('회원')));
    }
    await userInfo.destroy();
    userInfo.password = '';
    userInfo.passwordSalt = '';
    return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.X_DELETE_SUCCESS('회원'), userInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(authUtil.successFalse(resMessage.X_DELETE_FAIL('회원')));
  }
};

export const createTempPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOneByEmail(email);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.NO_X('이메일')));
    }

    let tempPasswordIssueCount;
    if (!user.tempPasswordCreatedAt || user.tempPasswordIssueCount < 3) {
      tempPasswordIssueCount = user.tempPasswordIssueCount + 1;
    } else if (user.tempPasswordCreatedAt.getDate() != new Date().getDate()) {
      tempPasswordIssueCount = 1;
    } else {
      return res.status(statusCode.BAD_REQUEST).json(authUtil.successFalse(resMessage.TEMP_PASSWORD_ISSUE_EXCEDDED));
    }

    const randomString = Math.random().toString(36).slice(2);
    const updatedUser = await usersService.updateTempPassword(user, randomString, tempPasswordIssueCount);
    await emailUtil.send(email, randomString);

    return res.status(statusCode.OK).json(
      authUtil.successTrue(resMessage.X_SUCCESS('임시 비밀번호 발급'), {
        email: email,
        tempPasswordIssueCount: updatedUser.tempPasswordIssueCount,
      })
    );
  } catch (err) {
    console.log(err);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(authUtil.successFalse(resMessage.X_FAIL('임시 비밀번호 발급')));
  }
};
