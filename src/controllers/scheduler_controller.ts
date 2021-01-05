import { schedulerService } from '../services';
import schedule from 'node-schedule';
import dayjs from 'dayjs';

export const deleteAllYesterday = () => {
  schedule.scheduleJob('0 0 22 * * *', async () => {
    try {
      const yesterday = dayjs(new Date()).subtract(1, 'day').set('hour', 6).set('minute', 0).set('second', 0);
      await schedulerService.deleteAllYesterday(yesterday);
    } catch (err) {}
  });
};
