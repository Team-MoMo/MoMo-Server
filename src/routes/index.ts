import express, { Request, Response, NextFunction } from 'express';
import users from './users';
import diaries from './diaries';
import sentences from './sentences';
import emotions from './emotions';
import { statusCode } from '../utils';
import { schedulerController } from '../controllers';

const router = express.Router();
schedulerController.deleteAllYesterday();

router.use('/users', users);
router.use('/diaries', diaries);
router.use('/sentences', sentences);
router.use('/emotions', emotions);

// health check API
router.get('/', (req: Request, res: Response, next: NextFunction) => {
  return res.status(statusCode.OK);
});

export default router;
