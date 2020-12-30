import express, { Request, Response, NextFunction } from 'express';
import { diariesController } from '../../controllers';
const router = express.Router();

router.get('/', diariesController.readAll);
router.get('/:id', diariesController.readOne);
router.post('/', diariesController.create);
router.put('/:id', diariesController.updateOne);
router.delete('/:id', diariesController.deleteOne);

export default router;
