import express from 'express';
import { usersController } from '../controllers';
import { jwt } from '../utils';
import { validate } from '../middleWares';
import yup from '../utils/yup';
const router = express.Router();

router.get('/signup', validate(yup.user.checkDuplicateEmailQuery), usersController.checkDuplicateEmail);
router.post('/signup', validate(yup.user.signupBody), usersController.signup);
router.post('/signin/social', validate(yup.user.signinBySocialBody), usersController.signinBySocial);
router.post('/signin', validate(yup.user.signinBody), usersController.signin);
router.post(
  '/:id/password',
  jwt.isLoggedIn,
  validate(yup.user.checkPasswordParams),
  validate(yup.user.checkPasswordBody),
  usersController.checkPassword
);
router.get('/', jwt.isLoggedIn, usersController.readAll);
router.get('/:id', jwt.isLoggedIn, validate(yup.user.readOneParams), usersController.readOne);
router.put(
  '/:id/alarm',
  jwt.isLoggedIn,
  validate(yup.user.updateAlarmParams),
  validate(yup.user.updatdAlarmBody),
  usersController.updateAlarm
);
router.put(
  '/:id/password',
  jwt.isLoggedIn,
  validate(yup.user.updatePasswordParams),
  validate(yup.user.updatePasswordBody),
  usersController.updatePassword
);
router.delete('/:id', jwt.isLoggedIn, validate(yup.user.deleteOneParams), usersController.deleteOne);
router.post('/password/temp', validate(yup.user.updateTempPasswordBody), usersController.updateTempPassword);

export default router;
