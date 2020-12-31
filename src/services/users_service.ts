import crypto from 'crypto';
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

export const updateInfo = async (id: any, name: any, alarmTime: any) => {
  if (name == null) {
    try {
      const alarmTimeChange = await model.User.update(
        {
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
  } else if (alarmTime == null) {
    try {
      const nameChange = await model.User.update(
        {
          name,
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
      const allUserInfoChange = await model.User.update(
        {
          name,
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
    const deleteDiary = await model.Diary.destroy({
      where: {
        id,
      },
    })
      .then(async () => {
        const deleteNotification = await model.Notification.destroy({
          where: {
            id,
          },
        });
      })
      .then(async () => {
        const deleteUser = await model.User.destroy({
          where: {
            id,
          },
        });
      });
  } catch (err) {
    throw err;
  }
};
