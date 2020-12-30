import express, { Request, Response, NextFunction } from 'express';
import { emotions_controller } from '../../controllers';
var router = express.Router();

router.get('/', emotions_controller.readAll);

export default router;
