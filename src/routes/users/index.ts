import express from 'express';
import { usersController } from '../../controllers';
const router = express.Router();

router.post('/signup', usersController.signup);
router.post('/signin/apple', usersController.signinByApple);
router.post('/signin/social', usersController.signinBySocial);
router.post('/signin', usersController.signin);
router.post('/:id/password', usersController.checkPassword);
router.get('/', usersController.readAll);
router.get('/:id', usersController.readOne);
router.put('/:id/alarm', usersController.updateAlarm);
router.put('/:id/password', usersController.updatePassword);
router.delete('/:id', usersController.deleteOne);
router.post('/password/temp', usersController.createTempPassword);

export default router;
