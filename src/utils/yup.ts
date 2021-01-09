import * as yup from 'yup';
import { RequestType } from '../middleWares';

const inputValidation = {
  id: yup.number().required(),
  email: yup.string().required().email(),
  password: yup
    .string()
    .required()
    .matches(/^[a-zA-Z0-9]{6,}$/),
  socialName: yup.string().required().oneOf(['kakao', 'google', 'apple']),
  accessToken: yup.string().required(),
  isAlarmSet: yup.boolean().required(),
  alarmTime: yup.string().notRequired(),
};

export const yupUtil = {
  signupBody: {
    shape: { email: inputValidation.email, password: inputValidation.password },
    path: RequestType.BODY,
  },
  signinBySocialBody: {
    shape: { socialName: inputValidation.socialName, accessToken: inputValidation.accessToken },
    path: RequestType.BODY,
  },
  signinBody: {
    shape: { email: inputValidation.email, password: inputValidation.password },
    path: RequestType.BODY,
  },
  checkPasswordParams: {
    shape: { id: inputValidation.id },
    path: RequestType.PARAMS,
  },
  checkPasswordBody: {
    shape: { password: inputValidation.password },
    path: RequestType.BODY,
  },
  readOneParams: {
    shape: { id: inputValidation.id },
    path: RequestType.PARAMS,
  },
  updateAlarmParams: {
    shape: { id: inputValidation.id },
    path: RequestType.PARAMS,
  },
  updatdAlarmBody: {
    shape: { isAlarmSet: inputValidation.isAlarmSet, alarmTime: inputValidation.alarmTime },
    path: RequestType.BODY,
  },
  updatePasswordParams: {
    shape: { id: inputValidation.id },
    path: RequestType.PARAMS,
  },
  updatePasswordBody: {
    shape: { newPassword: inputValidation.password },
    path: RequestType.BODY,
  },
  deleteOneBody: {
    shape: { id: inputValidation.id },
    path: RequestType.PARAMS,
  },
  createTempPasswordBody: {
    shape: { email: inputValidation.email },
    path: RequestType.BODY,
  },
};

export default yupUtil;
