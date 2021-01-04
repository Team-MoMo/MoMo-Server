import crypto from 'crypto';
import model from '../models';
import User from '../models/users_model';

export const signup = async (email: string, name: string, password: string) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  const user = await model.User.create({
    email,
    name,
    password: hashedPassword,
    passwordSalt: salt,
  });
  return user;
};

(password: string, salt: string) => {
  return;
};

export const signin = (user: User, password: string) => {
  const hashedPassword = crypto.pbkdf2Sync(password, user.passwordSalt, 10000, 64, 'sha512').toString('base64');
  if (hashedPassword != user.password) {
    return false;
  }
  return true;
};

export const signupByApple = async () => {
  try {
  } catch (err) {}
};

export const signupByKakao = async () => {
  try {
  } catch (err) {}
};

export const readAll = async () => {
  const users = await model.User.findAll();
  return users;
};

export const readOne = async (id: number) => {
  const user = await model.User.findOne({
    where: {
      id,
    },
  });
  return user;
};

export const readOneByEmail = async (email: string) => {
  const user = await model.User.findOne({
    where: { email },
  });
  return user;
};

export const updateAlarmSet = async (id: number, isAlarmSet: boolean) => {
  await model.User.update(
    {
      isAlarmSet,
    },
    {
      where: {
        id,
      },
    }
  );

  const userAlarmInfo = await model.User.findOne({
    attributes: ['isAlarmSet', 'alarmTime'],
    where: {
      id,
    },
  });
  return userAlarmInfo;
};

export const updateAlarmTime = async (id: number, isAlarmSet: boolean, alarmTime: Date) => {
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
  );

  const userAlarmInfo = await model.User.findOne({
    attributes: ['isAlarmSet', 'alarmTime'],
    where: {
      id,
    },
  });

  return userAlarmInfo;
};

export const checkPassword = async (user: User, password: string) => {
  const hashedPassword = crypto.pbkdf2Sync(password, user.passwordSalt, 10000, 64, 'sha512').toString('base64');
  if (hashedPassword != user.password) {
    return false;
  } else {
    return true;
  }
};

export const updatePassword = async (id: number, password: string) => {
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

export const deleteOne = async (user: User) => {
  await model.User.destroy({
    where: {
      id: user.id,
    },
  });
  return;
};
