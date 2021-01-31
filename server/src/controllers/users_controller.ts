import { statusCode, jwt, resJson, emailUtil, resMessage, loginUtil } from '../utils';
import { Request, Response } from 'express';
import { usersService } from '../services';
import User from '../models/users_model';

const USER: string = '회원';
const ALARM: string = '알람';
const PASSWORD: string = '비밀번호';
const TEMP_PASSWORD: string = '임시 비밀번호';
const CHECK_DUPLICATE_EMAIL: string = '이메일 중복 확인';

export const checkDuplicateEmail = async (req: Request, res: Response) => {
  const { email }: { email?: string } = req.query;
  try {
    const user = await usersService.readOneByEmail(email!);
    if (user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.DUPLICATE_EMAIL));
    }
    return res.status(statusCode.OK).json(resJson.success(resMessage.POSSIBLE_EMAIL));
  } catch (err) {
    console.log(err);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(resJson.fail(resMessage.X_FAIL(CHECK_DUPLICATE_EMAIL), err));
  }
};

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await usersService.readOneByEmail(email);
    if (user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.DUPLICATE_EMAIL));
    }

    const newUser = await usersService.create(email, password);
    const { token } = jwt.sign(newUser);
    loginUtil.blindPassword(newUser);

    return res.status(statusCode.CREATED).json(resJson.success(resMessage.SIGN_UP_SUCCESS, { user: newUser, token }));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.SIGN_UP_FAIL, err));
  }
};

export const signinBySocial = async (req: Request, res: Response) => {
  const { socialName, accessToken } = req.body;

  try {
    let userId;
    if (socialName === 'kakao') {
      userId = await loginUtil.kakao(accessToken);
    } else if (socialName === 'google') {
      userId = await loginUtil.google(accessToken);
    } else if (socialName === 'apple') {
      userId = await loginUtil.apple(accessToken);
    }

    if (!userId) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.INVALID_TOKEN));
    }

    let user = await usersService.readOneByEmail(userId);
    if (!user) {
      user = await usersService.create(userId, accessToken);
    }
    const { token } = jwt.sign(user);
    loginUtil.blindPassword(user);

    return res.status(statusCode.OK).json(resJson.success(resMessage.SIGN_IN_SUCCESS, { user, token }));
  } catch (err) {
    console.log(err);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.SIGN_IN_FAIL, err));
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await usersService.readOneByEmail(email);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    if (!usersService.checkPassword(user, password)) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.MISS_MATCH_USER_INFO));
    }

    const { token } = jwt.sign(user);
    loginUtil.blindPassword(user);

    return res.status(statusCode.OK).json(resJson.success(resMessage.SIGN_IN_SUCCESS, { user, token }));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.SIGN_IN_FAIL, err));
  }
};

export const readAll = async (req: Request, res: Response) => {
  try {
    let users = await usersService.readAll();
    users = users.map((user: User) => {
      loginUtil.blindPassword(user);
      return user;
    });

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_READ_ALL_SUCCESS(USER), users));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_READ_ALL_FAIL(USER)));
  }
};

export const readOne = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { id }: { id?: number } = req.params;

  if (id !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  try {
    const user = await usersService.readOne(id!);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }
    loginUtil.blindPassword(user);

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_READ_SUCCESS(USER), user));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_READ_FAIL(USER), err));
  }
};

export const updateAlarm = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { id }: { id?: number } = req.params;
  const { isAlarmSet, alarmTime } = req.body;

  if (id !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  try {
    const user = await usersService.readOne(id!);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    let updatedUser;
    if (!alarmTime) {
      updatedUser = await usersService.updateAlarmSet(user, isAlarmSet);
    } else {
      updatedUser = await usersService.updateAlarmTime(user, isAlarmSet, alarmTime);
    }
    const alarmInfo = { isAlarmSet: updatedUser.isAlarmSet, alarmTime: updatedUser.alarmTime };

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_UPDATE_SUCCESS(ALARM), alarmInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_UPDATE_FAIL(ALARM), err));
  }
};

export const checkPassword = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { id }: { id?: number } = req.params;
  const { password } = req.body;

  if (id !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  try {
    const user = await usersService.readOne(id!);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    const checkPasswordResult = usersService.checkPassword(user, password);
    if (!checkPasswordResult) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.MISS_MATCH_PASSWORD));
    }

    return res.status(statusCode.OK).json(resJson.success(resMessage.MATCH_PASSWORD));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.INTERNAL_SERVER_ERROR, err));
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { id }: { id?: number } = req.params;
  const { newPassword } = req.body;

  if (id !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  try {
    const user = await usersService.readOne(id!);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    const checkPasswordResult = await usersService.checkPassword(user, newPassword);
    if (checkPasswordResult) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.SAME_PASSWORD_AND_NEW_PASSWORD));
    }

    const updatedUser = await usersService.updatePassword(user, newPassword);
    loginUtil.blindPassword(updatedUser);

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_UPDATE_SUCCESS(PASSWORD), user));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_UPDATE_FAIL(PASSWORD), err));
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const decodedUserId = req.decoded?.userId;
  const { id }: { id?: number } = req.params;

  if (id !== decodedUserId) {
    return res.status(statusCode.UNAUTHORIZED).json(resJson.fail(resMessage.UNAUTHORIZED));
  }

  try {
    const user = await usersService.readOne(id!);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    await usersService.deleteOne(user);
    loginUtil.blindPassword(user);

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_DELETE_SUCCESS(USER), user));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_DELETE_FAIL(USER), err));
  }
};

export const updateTempPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await usersService.readOneByEmail(email);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    const isNeverIssued = !user.tempPasswordCreatedAt ? true : false;
    const isIssueToday = user.tempPasswordCreatedAt?.getDate() === new Date().getDate();

    let tempPasswordIssueCount;
    if (isNeverIssued || user.tempPasswordIssueCount < 3) {
      tempPasswordIssueCount = user.tempPasswordIssueCount + 1;
    } else if (!isIssueToday) {
      tempPasswordIssueCount = 1;
    } else {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.TEMP_PASSWORD_ISSUE_EXCEDDED));
    }

    const randomString = Math.random().toString(36).slice(5);
    await emailUtil.send(email, randomString);
    const updatedUser = await usersService.updateTempPassword(user, randomString, tempPasswordIssueCount);
    const tempPasswordInfo = {
      email: email,
      tempPasswordIssueCount: updatedUser.tempPasswordIssueCount,
    };

    return res
      .status(statusCode.OK)
      .json(resJson.success(resMessage.X_UPDATE_SUCCESS(TEMP_PASSWORD), tempPasswordInfo));
  } catch (err) {
    console.log(err);
    return res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .json(resJson.fail(resMessage.X_UPDATE_FAIL(TEMP_PASSWORD), err));
  }
};
