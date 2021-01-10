import { statusCode, jwt, resJson, emailUtil, resMessage, loginUtil } from '../utils';
import { Request, Response } from 'express';
import { usersService } from '../services';
import User from '../models/users_model';

const USER: string = '회원';
const ALARM: string = '알람';
const PASSWORD: string = '비밀번호';
const TEMP_PASSWORD: string = '임시 비밀번호';

export const signup = async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOneByEmail(email);
    if (user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.DUPLICATE_ID));
    }

    const newUser = await usersService.create(email, password);
    const { token } = jwt.sign(newUser);
    loginUtil.blindPassword(newUser);

    return res.status(statusCode.OK).json(resJson.success(resMessage.SIGN_UP_SUCCESS, { user: newUser, token }));
  } catch (err) {
    console.log(err);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.SIGN_UP_FAIL));
  }
};

export const signinByApple = async (req: Request, res: Response) => {
  const {} = req.body;

  try {
  } catch (err) {}
};

export const signinBySocial = async (req: Request, res: Response) => {
  const { socialName, accessToken }: { socialName: 'kakao' | 'google'; accessToken: string } = req.body;
  if (!socialName || !accessToken) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }
  try {
    let userId;
    if (socialName == 'kakao') {
      userId = await loginUtil.kakao(accessToken);
    } else {
      userId = await loginUtil.google(accessToken);
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
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.SIGN_IN_FAIL));
  }
};

export const signin = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

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
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.SIGN_IN_FAIL));
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
  const { id }: { id?: number } = req.params;
  if (!id) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOne(id);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }
    loginUtil.blindPassword(user);

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_READ_SUCCESS(USER), user));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_READ_FAIL(USER)));
  }
};

export const updateAlarm = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  const { isAlarmSet, alarmTime } = req.body;
  if (!id || !isAlarmSet) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOne(id);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    let updatedUser;
    if (!alarmTime) {
      updatedUser = await usersService.updateAlarmSet(user, isAlarmSet);
    } else {
      updatedUser = await usersService.updateAlarmTime(user, isAlarmSet, alarmTime);
    }
    const alarmInfo = { isAlarmSet: user.isAlarmSet, alarmTime: user.alarmTime };

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_UPDATE_SUCCESS(ALARM), alarmInfo));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_UPDATE_FAIL(ALARM)));
  }
};

export const checkPassword = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  const { password } = req.body;
  if (!id || !password) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOne(id);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    const checkPasswordResult = await usersService.checkPassword(user, password);
    if (!checkPasswordResult) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.MISS_MATCH_PASSWORD));
    }

    return res.status(statusCode.OK).json(resJson.success(resMessage.MATCH_PASSWORD));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.INTERNAL_SERVER_ERROR));
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  const { newPassword } = req.body;
  if (!id || !newPassword) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOne(id);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    const checkPasswordResult = await usersService.checkPassword(user, newPassword);
    if (!checkPasswordResult) {
      const updatedUser = await usersService.updatePassword(user, newPassword);
      loginUtil.blindPassword(updatedUser);

      return res.status(statusCode.OK).json(resJson.success(resMessage.X_UPDATE_SUCCESS(PASSWORD), user));
    }
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.SAME_PASSWORD_AND_NEW_PASSWORD));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_UPDATE_FAIL(PASSWORD)));
  }
};

export const deleteOne = async (req: Request, res: Response) => {
  const { id }: { id?: number } = req.params;
  if (!id) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOne(id);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    await usersService.deleteOne(user);
    loginUtil.blindPassword(user);

    return res.status(statusCode.OK).json(resJson.success(resMessage.X_DELETE_SUCCESS(USER), user));
  } catch (err) {
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_DELETE_FAIL(USER)));
  }
};

export const createTempPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NULL_VALUE));
  }

  try {
    const user = await usersService.readOneByEmail(email);
    if (!user) {
      return res.status(statusCode.BAD_REQUEST).json(resJson.fail(resMessage.NO_X(USER)));
    }

    let tempPasswordIssueCount;
    if (!user.tempPasswordCreatedAt || user.tempPasswordIssueCount < 3) {
      tempPasswordIssueCount = user.tempPasswordIssueCount + 1;
    } else if (user.tempPasswordCreatedAt.getDate() != new Date().getDate()) {
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
      .json(resJson.success(resMessage.X_CREATE_SUCCESS(TEMP_PASSWORD), tempPasswordInfo));
  } catch (err) {
    console.log(err);
    return res.status(statusCode.INTERNAL_SERVER_ERROR).json(resJson.fail(resMessage.X_CREATE_FAIL(TEMP_PASSWORD)));
  }
};
