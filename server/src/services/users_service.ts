import crypto from 'crypto';
import model from '../models';
import User from '../models/users_model';

export const create = async (email: string, password: string) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  const user = await model.User.create({
    email,
    password: hashedPassword,
    passwordSalt: salt,
  });
  return await model.User.findByPk(user.id);
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
  const user = (await model.User.findOne({
    where: {
      id,
    },
  })) as User;
  return user;
};

export const readOneByEmail = async (email: string) => {
  const user = await model.User.findOne({
    where: { email },
  });
  return user;
};

export const deleteOne = async (user: User) => {
  await user.destroy();
  return;
};

export const checkPassword = (user: User, password: string) => {
  const hashedPassword = crypto.pbkdf2Sync(password, user.passwordSalt, 10000, 64, 'sha512').toString('base64');
  if (hashedPassword != user.password && hashedPassword != user.tempPassword) {
    return false;
  }
  return true;
};

export const updatePassword = async (user: User, password: string) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  return await user.update({
    password: hashedPassword,
    passwordSalt: salt,
  });
};

export const updateTempPassword = async (user: User, tempPassword: string, tempPasswordIssueCount: number) => {
  const hashedTempPassword = crypto.pbkdf2Sync(tempPassword, user.passwordSalt, 10000, 64, 'sha512').toString('base64');
  return await user.update({
    tempPassword: hashedTempPassword,
    tempPasswordCreatedAt: new Date(),
    tempPasswordIssueCount: tempPasswordIssueCount,
  });
};

export const updateAlarmSet = async (user: User, isAlarmSet: boolean) => {
  return await user.update({
    isAlarmSet,
  });
};

export const updateAlarmTime = async (user: User, isAlarmSet: boolean, alarmTime: Date) => {
  return await user.update({
    isAlarmSet,
    alarmTime,
  });
};

export const updateExportedAt = async (user: User, exportedAt: Date, exportationCount: number) => {
  return await user.update({
    exportedAt,
    exportationCount,
  });
};
