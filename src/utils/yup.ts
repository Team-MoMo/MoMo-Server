import * as yup from 'yup';
import { RequestType } from '../middleWares';

const socialType = ['kakao', 'google', 'apple'];
const orderType = ['depth', 'filter'];
const emotionType = ['사랑', '행복', '슬픔', '화남', '위로', '권태', '추억', '일상'];

//default : required
const validation = {
  number: yup.number().required(),
  optionalNumber: yup.number().notRequired(),
  email: yup.string().required().email(),
  string: yup.string().required(),
  optionalString: yup.string().notRequired(),
  boolean: yup.boolean().required(),
  date: yup.date().required(),

  //user
  password: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9]{6,}$/),
  socialName: yup.string().required().oneOf(socialType),
  time: yup
    .string()
    .notRequired()
    .matches(/^\d\d:\d\d$/),

  //diary
  order: yup.string().notRequired().oneOf(orderType),

  //sentences
  emotionList: yup.array().required().of(yup.string().oneOf(emotionType)),
};

export const user = {
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
  deleteOneBody: {
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
      depth: validation.optionalNumber,
      year: validation.number,
      month: validation.number,
      day: validation.optionalNumber,
    },
    path: RequestType.QUREY,
  },
  readRecentOneQuery: {
    shape: {
      userId: validation.number,
    },
    path: RequestType.QUREY,
  },
  readStatisticsQuery: {
    shape: {
      userId: validation.number,
      year: validation.number,
      month: validation.number,
    },
    path: RequestType.QUREY,
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
      depth: validation.number,
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
      depth: validation.optionalNumber,
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
    path: RequestType.QUREY,
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
