import crypto from 'crypto';
import { Sequelize } from 'sequelize/types';
import model from '../models';

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
  try {
    const users = await model.User.findAll();
    return users;
  } catch (err) {
    throw err;
  }
};

export const readOne = async (id: any) => {
  try {
    const user = await model.User.findOne({
      where: {
        id,
      },
    });
    return user;
  } catch (err) {
    throw err;
  }
};

export const readOneByEmail = async () => {
  try {
  } catch (err) {}
};

export const updateAlarm = async (id: any, alarmTime: Date) => {
  console.log(alarmTime);
  if (alarmTime) {
    try {
      const alarmTimeChange = await model.User.update(
        {
          isAlarmSet: true,
          alarmTime,
        },
        {
          where: {
            id,
          },
        }
      );
      return;
    } catch (err) {
      throw err;
    }
  } else {
    try {
      await model.User.update(
        {
          isAlarmSet: false,
          alarmTime: null,
          //alarmTime null로 바꿔야할지말지 생각중(view 보고)
        },
        {
          where: {
            id,
          },
        }
      );
      return;
    } catch (err) {
      throw err;
    }
  }
};

export const updatePassword = async (id: any, password: any) => {
  try {
    const salt = crypto.randomBytes(64).toString('base64');
    const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64'); //회원가입 보고 확인하기
    const passwordChange = await model.User.update(
      {
        password: hashedPassword,
      },
      {
        where: {
          id,
        },
      }
    );
    return;
  } catch (err) {
    throw err;
  }
};

export const deleteOne = async (id: any) => {
  try {
    await model.User.destroy({
      where: {
        id,
      },
    });
    return;
  } catch (err) {
    console.log('serviceError');
    throw err;
  }
};
