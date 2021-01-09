import express from 'express';
import { sentencesController } from '../../controllers';
const router = express.Router();

router.get('/', sentencesController.readAll);
router.post('/', sentencesController.create);

export default router;
