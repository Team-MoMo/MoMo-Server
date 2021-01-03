import crypto from 'crypto';
import db from '../models';
import User from '../models/users_model';

export const signup = async (email: string, name: string, password: string) => {
  const salt = crypto.randomBytes(64).toString('base64');
  const hashedPassword = hashPassword(password, salt);
  const user = await db.User.create({
    email,
    name,
    password: hashedPassword,
    passwordSalt: salt,
  });
  return user;
};

export const signin = (user: User, password: string) => {
  const hashedPassword = hashPassword(password, user.passwordSalt);
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

export const hashPassword = (password: string, salt: string) => {
  try {
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  } catch (err) {
    throw err;
  }
};

export const readAll = async () => {
  try {
    console.log('success'); //라우팅 테스트용
  } catch (err) {}
};

export const readOne = async () => {
  try {
  } catch (err) {}
};

export const readOneByEmail = async (email: string) => {
  const user = await db.User.findOne({
    where: { email },
  });
  return user;
};

export const updateInfo = async () => {
  try {
  } catch (err) {}
};

export const updatePassword = async () => {
  try {
  } catch (err) {}
};

export const deleteOne = async () => {
  try {
  } catch (err) {}
};
