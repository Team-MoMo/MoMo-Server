import express, { Request, Response, NextFunction } from 'express';
import { sentencesController } from '../../controllers';
const router = express.Router();

router.get('/', sentencesController.readAll);

export default router;
