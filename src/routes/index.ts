import express, { Request, Response, NextFunction } from 'express';
var router = express.Router();
import users from './users/index';
import diaries from './diaries/index';
import sentences from './sentences';
import emotions from './emotions';

router.use('/users', users);
router.use('/diaries', diaries);
router.use('/sentences', sentences);
router.use('/emotions', emotions);

/* GET home page. */
router.get('/', function (req: Request, res: Response, next: NextFunction) {
  return res.json({ body: { data: 'MoMo Server' } });
});

export default router;
