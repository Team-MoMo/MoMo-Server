import { Op } from 'sequelize';
import model from '../models';
import dayjs from 'dayjs';

export const deleteAllYesterday = async (yesterday: dayjs.Dayjs) => {
  try {
    await model.UsersRecommendedSentences.destroy({
      where: {
        createdAt: { [Op.lt]: yesterday.format('YYYY-MM-DD HH:mm') },
      },
    });
  } catch (err) {}
};
