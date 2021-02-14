import express from 'express';
import { emotionsController } from '../controllers';
import { jwt } from '../utils';
const router = express.Router();

router.get('/', jwt.isLoggedIn, emotionsController.readAll);

export default router;
