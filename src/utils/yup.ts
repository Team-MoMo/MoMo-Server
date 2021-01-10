import * as yup from 'yup';
import { RequestType } from '../middleWares';

const socialType = ['kakao', 'google', 'apple'];
const orderType = ['depth', 'filter'];

//default : required
const validation = {
  number: yup.number().required(),
  optionalNumber: yup.number().notRequired(),
  email: yup.string().required().email(),
  string: yup.string().required(),
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
  createTempPasswordBody: {
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
      wroteAt: validation.string,
      userId: validation.number,
      depth: validation.number,
      contents: validation.string,
      sentenceId: validation.number,
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

export default { user, diary };
