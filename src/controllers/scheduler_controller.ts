import { schedulerService } from '../services';
import schedule from 'node-schedule';
import dayjs from 'dayjs';

export const deleteAllYesterday = async () => {
  schedule.scheduleJob('0 0 6 * * *', async () => {
    try {
      const today = dayjs(new Date()).add(9, 'hour');
      const yesterday = today.subtract(1, 'day').set('hour', 6).set('minute', 0).set('second', 0);
      await schedulerService.deleteAllYesterday(yesterday);
    } catch (err) {}
  });
};
