import express, { Request, Response, NextFunction } from 'express';
import { sentences_controller } from '../../controllers';
var router = express.Router();

router.get('/', sentences_controller.readAll);

export default router;
