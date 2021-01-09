import express from 'express';
import { usersController } from '../controllers';
import { jwt } from '../utils';
import { validate } from '../middleWares';
import yup from '../utils/yup';
const router = express.Router();

router.post('/signup', validate(yup.signupBody), usersController.signup);
router.post('/signin/social', validate(yup.signinBySocialBody), usersController.signinBySocial);
router.post('/signin', validate(yup.signinBody), usersController.signin);
router.post(
  '/:id/password',
  jwt.isLoggedIn,
  validate(yup.checkPasswordParams),
  validate(yup.checkPasswordBody),
  usersController.checkPassword
);
router.get('/', jwt.isLoggedIn, usersController.readAll);
router.get('/:id', jwt.isLoggedIn, validate(yup.readOneParams), usersController.readOne);
router.put(
  '/:id/alarm',
  jwt.isLoggedIn,
  validate(yup.updateAlarmParams),
  validate(yup.updatdAlarmBody),
  usersController.updateAlarm
);
router.put(
  '/:id/password',
  jwt.isLoggedIn,
  validate(yup.updatePasswordParams),
  validate(yup.updatePasswordBody),
  usersController.updatePassword
);
router.delete('/:id', jwt.isLoggedIn, validate(yup.deleteOneBody), usersController.deleteOne);
router.post('/password/temp', validate(yup.createTempPasswordBody), usersController.createTempPassword);

export default router;
