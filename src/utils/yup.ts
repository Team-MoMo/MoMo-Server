import * as yup from 'yup';
import { RequestType } from '../middleWares';

const socialType = ['kakao', 'google', 'apple'];
const orderType = ['depth', 'filter'];
const emotionType = ['사랑', '행복', '위로', '화남', '슬픔', '우울', '추억', '일상'];

const validation = {
  number: yup.number().required(),
  email: yup.string().required().email(),
  string: yup.string().required(),
  boolean: yup.boolean().required(),
  date: yup.date().required(),
  optionalString: yup.string().notRequired(),
  optionalNumber: yup.number().notRequired(),

  //user
  password: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9!@#$%^&*(),.?\":{}|<>_-]{6,}$/),
  socialName: yup.string().required().oneOf(socialType),
  time: yup
    .string()
    .notRequired()
    .matches(/^\d\d:\d\d$/),

  //diary
  order: yup.string().notRequired().oneOf(orderType),
  depth: yup.number().notRequired().max(6),
  day: yup.number().notRequired().max(31),
  emotionList: yup.array().required().of(yup.string().oneOf(emotionType)),
};

export const user = {
  checkDuplicateEmailQuery: {
    shape: { email: validation.email },
    path: RequestType.QUERY,
  },
  signupBody: {
    shape: { email: validation.email, password: validation.password },
    path: RequestType.BODY,
  },
  signinBySocialBody: {
    shape: { socialName: validation.socialName, accessToken: validation.string },
    path: RequestType.BODY,
  },
  signinBody: {
    shape: { email: validation.email, password: validation.password },
    path: RequestType.BODY,
  },
  checkPasswordParams: {
    shape: { id: validation.number },
    path: RequestType.PARAMS,
  },
  checkPasswordBody: {
    shape: { password: validation.password },
    path: RequestType.BODY,
  },
  readOneParams: {
    shape: { id: validation.number },
    path: RequestType.PARAMS,
  },
  updateAlarmParams: {
    shape: { id: validation.number },
    path: RequestType.PARAMS,
  },
  updatdAlarmBody: {
    shape: { isAlarmSet: validation.boolean, alarmTime: validation.time },
    path: RequestType.BODY,
  },
  updatePasswordParams: {
    shape: { id: validation.number },
    path: RequestType.PARAMS,
  },
  updatePasswordBody: {
    shape: { newPassword: validation.password },
    path: RequestType.BODY,
  },
  deleteOneParams: {
    shape: { id: validation.number },
    path: RequestType.PARAMS,
  },
  updateTempPasswordBody: {
    shape: { email: validation.email },
    path: RequestType.BODY,
  },
};

const diary = {
  readAllQuery: {
    shape: {
      order: validation.order,
      userId: validation.number,
      emotionId: validation.optionalNumber,
      depth: validation.depth,
      year: validation.number,
      month: validation.number,
      day: validation.day,
    },
    path: RequestType.QUERY,
  },
  readRecentOneQuery: {
    shape: {
      userId: validation.number,
    },
    path: RequestType.QUERY,
  },
  readStatisticsQuery: {
    shape: {
      userId: validation.number,
      year: validation.number,
      month: validation.number,
    },
    path: RequestType.QUERY,
  },
  readOneParams: {
    shape: {
      id: validation.number,
    },
    path: RequestType.PARAMS,
  },
  createBody: {
    shape: {
      emotionId: validation.number,
      contents: validation.string,
      depth: validation.depth,
      userId: validation.number,
      sentenceId: validation.number,
      wroteAt: validation.string,
    },
    path: RequestType.BODY,
  },
  updateOneParams: {
    shape: {
      id: validation.number,
    },
    path: RequestType.PARAMS,
  },
  updateOneBody: {
    shape: {
      wroteAt: validation.optionalString,
      userId: validation.optionalNumber,
      depth: validation.depth,
      contents: validation.optionalString,
      sentenceId: validation.optionalNumber,
      emotionId: validation.optionalNumber,
    },
    path: RequestType.BODY,
  },
  deleteOneParams: {
    shape: {
      id: validation.number,
    },
    path: RequestType.PARAMS,
  },
};

const sentence = {
  readAllQuery: {
    shape: {
      emotionId: validation.number,
      userId: validation.number,
    },
    path: RequestType.QUERY,
  },
  readAllOnboarding: {
    shape: {
      emotionId: validation.number,
    },
    path: RequestType.QUERY,
  },
  create: {
    shape: {
      contents: validation.string,
      bookName: validation.string,
      writer: validation.string,
      publisher: validation.string,
      emotion: validation.emotionList,
    },
    path: RequestType.BODY,
  },
};

export default { user, diary, sentence };
