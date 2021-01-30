import express from 'express';
import { sentencesController } from '../controllers';
import { validate } from '../middleWares';
import { jwt } from '../utils';
import yup from '../utils/yup';
const router = express.Router();

router.get(
  '/recommend',
  jwt.isLoggedIn,
  validate(yup.sentence.readRecommendedSentencesQuery),
  sentencesController.readRecommendedSentences
);
router.get('/', validate(yup.sentence.readAllQuery), sentencesController.readAll);
router.get('/onboarding', validate(yup.sentence.readAllOnboardingQuery), sentencesController.readAllOnboarding);
router.post('/', validate(yup.sentence.createBody), sentencesController.create);
router.put('/blind', validate(yup.sentence.blindAndDeleteBody), sentencesController.updateBlindedAt);
router.delete('/', validate(yup.sentence.blindAndDeleteBody), sentencesController.deleteAll);

export default router;
