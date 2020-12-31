import express, { Request, Response, NextFunction } from 'express';
import users from './users/index';
import diaries from './diaries/index';
import sentences from './sentences/index';
import emotions from './emotions/index';
const router = express.Router();

router.use('/users', users);
router.use('/diaries', diaries);
router.use('/sentences', sentences);
router.use('/emotions', emotions);

// health check API
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  return res.json({ body: { data: 'MoMo Server' } });
});

export default router;
