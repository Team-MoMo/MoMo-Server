import express, { Request, Response, NextFunction } from 'express';
import { diaries_controller } from '../../controllers';
var router = express.Router();

router.get('/', diaries_controller.readAll);
router.get('/:id', diaries_controller.readOne);
router.post('/', diaries_controller.create);
router.put('/:id', diaries_controller.updateOne);
router.delete('/:id', diaries_controller.deleteOne);

export default router;
