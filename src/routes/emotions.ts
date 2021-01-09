import express from 'express';
import { emotionsController } from '../controllers';
const router = express.Router();

router.get('/', emotionsController.readAll);

export default router;
