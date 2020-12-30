import express, { Request, Response, NextFunction } from 'express';
import { users_controller } from '../../controllers';
var router = express.Router();

router.post('/signup', users_controller.signup);
router.post('/signup/apple', users_controller.signupByApple);
router.post('/signup/kakao', users_controller.signupByKakao);
router.post('/signin', users_controller.signin);
router.get('/', users_controller.readAll);
router.get('/:id', users_controller.readOne);
router.put('/:id', users_controller.updateInfo);
router.put('/:id/password', users_controller.updatePassword);
router.delete('/:id', users_controller.deleteOne);

export default router;
