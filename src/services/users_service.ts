import { Console } from 'console';
import crypto from 'crypto';
import { Sequelize } from 'sequelize/types';
import model from '../models';
import User from '../models/users_model';

export const signup = async () => {
  try {
  } catch (err) {}
};

export const signupByApple = async () => {
  try {
  } catch (err) {}
};

export const signupByKakao = async () => {
  try {
  } catch (err) {}
};

export const signin = async () => {
  try {
  } catch (err) {}
};

export const readAll = async () => {
  const users = await model.User.findAll();
  return users;
};

export const readOne = async (id: any) => {
  const user = await model.User.findOne({
    where: {
      id,
    },
  });
  return user;
};

export const readOneByEmail = async () => {
  try {
  } catch (err) {}
};

export const updateAlarm = async (id: any, isAlarmSet: boolean, alarmTime: Date) => {
  let userAlarmTime: any;
  if (alarmTime) {
    await model.User.update(
      {
        isAlarmSet,
        alarmTime,
      },
      {
        where: {
          id,
        },
      }
    ).then(async () => {
      userAlarmTime = await model.User.findOne({
        attributes: ['isAlarmSet', 'alarmTime'],
        where: {
          id,
        },
      });
    });

    return userAlarmTime;
  } else {
    await model.User.update(
      {
        isAlarmSet,
      },
      {
        where: {
          id,
        },
      }
    ).then(async () => {
      userAlarmTime = await model.User.findOne({
        attributes: ['isAlarmSet', 'alarmTime'],
        where: {
          id,
        },
      });
    });
    return userAlarmTime;
  }
};

export const checkPassword = async (user: User, password: string) => {
  const hashedPassword = crypto.pbkdf2Sync(password, user.passwordSalt, 10000, 64, 'sha512').toString('base64');
  if (hashedPassword != user.password) {
    return false;
  } else {
    return true;
  }
};

export const updatePassword = async (id: any, password: string) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64'); //채원이 hash service
  await model.User.update(
    {
      password: hashedPassword,
      passwordSalt: salt,
    },
    {
      where: {
        id,
      },
    }
  );
  return;
};

export const deleteOne = async (id: any) => {
  await model.User.destroy({
    where: {
      id,
    },
  });
  return;
};
