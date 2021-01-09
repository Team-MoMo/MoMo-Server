import express from 'express';
import { diariesController } from '../controllers';
const router = express.Router();

router.get('/statistics', diariesController.readStatistics);
router.get('/recent', diariesController.readRecentOne);
router.get('/:id', diariesController.readOne);
router.get('/', diariesController.readAll);
router.post('/', diariesController.create);
router.put('/:id', diariesController.updateOne);
router.delete('/:id', diariesController.deleteOne);

export default router;
