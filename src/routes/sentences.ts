import express from 'express';
import { sentencesController } from '../controllers';
import { jwt } from '../utils';
const router = express.Router();

router.get('/', jwt.isLoggedIn, sentencesController.readAll);

export default router;
