import model from '../models';

export const readAll = async () => {
  try {
    const emotions = await model.Emotion.findAll({
      attributes: ['id', 'name'],
    });
    return emotions;
  } catch (err) {
    throw err;
  }
};
