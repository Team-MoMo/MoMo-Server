import express from 'express';
import { usersController } from '../controllers';
import { jwt } from '../utils';
const router = express.Router();

router.post('/signup', usersController.signup);
router.post('/signin/apple', usersController.signinByApple);
router.post('/signin/social', usersController.signinBySocial);
router.post('/signin', usersController.signin);
router.post('/:id/password', jwt.isLoggedIn, usersController.checkPassword);
router.get('/', jwt.isLoggedIn, usersController.readAll);
router.get('/:id', jwt.isLoggedIn, usersController.readOne);
router.put('/:id/alarm', jwt.isLoggedIn, usersController.updateAlarm);
router.put('/:id/password', jwt.isLoggedIn, usersController.updatePassword);
router.delete('/:id', jwt.isLoggedIn, usersController.deleteOne);
router.post('/password/temp', usersController.createTempPassword);

export default router;
