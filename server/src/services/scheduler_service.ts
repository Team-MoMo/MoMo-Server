import { Op } from 'sequelize';
import model from '../models';
import dayjs from 'dayjs';
import UsersRecommendedSentences from '../models/users_recommended_sentences_model';

export const readAllYesterday = async (yesterday: dayjs.Dayjs) => {
  try {
    const yesterdaySentences: UsersRecommendedSentences[] = await model.UsersRecommendedSentences.findAll({
      where: {
        createdAt: { [Op.lt]: yesterday.format('YYYY-MM-DD HH:mm') },
      },
    });
    return yesterdaySentences;
  } catch (err) {}
};

export const deleteAllYesterday = async (yesterdaySentences: UsersRecommendedSentences[]) => {
  try {
    yesterdaySentences.forEach(async (element) => {
      await element.destroy();
    });
    return;
  } catch (err) {}
};
