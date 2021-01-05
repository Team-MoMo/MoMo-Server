import { Op } from 'sequelize';
import model from '../models';
import dayjs from 'dayjs';

export const deleteAll = async (yesterday: dayjs.Dayjs) => {
  try {
    await model.UsersRecommendedSentences.destroy({
      where: {
        createdAt: { [Op.lt]: yesterday },
      },
    });
  } catch (err) {}
};
