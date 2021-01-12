import express from 'express';
import { sentencesController } from '../controllers';
import { validate } from '../middleWares';
import { jwt } from '../utils';
import yup from '../utils/yup';
const router = express.Router();

router.get('/', jwt.isLoggedIn, validate(yup.sentence.readAllQuery), sentencesController.readAll);
router.get('/onboarding', validate(yup.sentence.readAllOnboarding), sentencesController.readAllOnboarding);
router.post('/', validate(yup.sentence.create), sentencesController.create);

export default router;
