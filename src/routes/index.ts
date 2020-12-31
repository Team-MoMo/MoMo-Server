import express, { Request, Response, NextFunction } from 'express';
import users from './users/index';
import diaries from './diaries/index';
import sentences from './sentences/index';
import emotions from './emotions/index';
import { statusCode, authUtil } from '../utils';
import resMessage from '../utils/resMessage';
const router = express.Router();

router.use('/users', users);
router.use('/diaries', diaries);
router.use('/sentences', sentences);
router.use('/emotions', emotions);

// health check API
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  return res.status(statusCode.OK).json(authUtil.successTrue(resMessage.HEALTH_CHECK));
});

export default router;
