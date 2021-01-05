import util from '../utils/authUtil';
import resMessage from '../utils/resMessage';
import { Request, Response } from 'express';
import { schedulerService } from '../services';
import schedule from 'node-schedule';
import dayjs from 'dayjs';

export const deleteAll = () => {
  schedule.scheduleJob('0 0 6 * * *', async () => {
    try {
      const yesterday = dayjs(new Date()).subtract(1, 'day').set('hour', 6).set('minute', 0).set('second', 0);
      await schedulerService.deleteAll(yesterday);
    } catch (err) {}
  });
};
