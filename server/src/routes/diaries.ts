import express from 'express';
import { diariesController } from '../controllers';
import { jwt } from '../utils';
import { validate } from '../middleWares';
import yup from '../utils/yup';
const router = express.Router();

router.get('/statistics', jwt.isLoggedIn, validate(yup.diary.readStatisticsQuery), diariesController.readStatistics);
router.get('/recent', jwt.isLoggedIn, validate(yup.diary.readRecentOneQuery), diariesController.readRecentOne);
router.get('/:id', jwt.isLoggedIn, validate(yup.diary.readOneParams), diariesController.readOne);
router.get('/', jwt.isLoggedIn, validate(yup.diary.readAllQuery), diariesController.readAll);
router.post('/export', jwt.isLoggedIn, diariesController.exportUserDiaries);
router.post('/', jwt.isLoggedIn, validate(yup.diary.createBody), diariesController.create);
router.put(
  '/:id',
  jwt.isLoggedIn,
  validate(yup.diary.updateOneParams),
  validate(yup.diary.updateOneBody),
  diariesController.updateOne
);
router.delete('/:id', jwt.isLoggedIn, validate(yup.diary.deleteOneParams), diariesController.deleteOne);

export default router;
