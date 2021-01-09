import express from 'express';
import { diariesController } from '../controllers';
import { jwt } from '../utils';
const router = express.Router();

router.get('/statistics', jwt.isLoggedIn, diariesController.readStatistics);
router.get('/recent', jwt.isLoggedIn, diariesController.readRecentOne);
router.get('/:id', jwt.isLoggedIn, diariesController.readOne);
router.get('/', jwt.isLoggedIn, diariesController.readAll);
router.post('/', jwt.isLoggedIn, diariesController.create);
router.put('/:id', jwt.isLoggedIn, diariesController.updateOne);
router.delete('/:id', jwt.isLoggedIn, diariesController.deleteOne);

export default router;
