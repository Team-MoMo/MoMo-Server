import express, { Request, Response, NextFunction } from 'express';
import { usersController } from '../../controllers';
const router = express.Router();

router.post('/signup', usersController.signup);
router.post('/signup/apple', usersController.signupByApple);
router.post('/signup/kakao', usersController.signupByKakao);
router.post('/signin', usersController.signin);
router.get('/', usersController.readAll);
router.get('/:id', usersController.readOne);
router.put('/:id', usersController.updateInfo);
router.put('/:id/password', usersController.updatePassword);
router.delete('/:id', usersController.deleteOne);

export default router;