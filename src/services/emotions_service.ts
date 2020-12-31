import model from '../models';

export const readAll = async () => {
  try {
    const emotions = await model.Emotion.findAll();
    return emotions;
  } catch (err) {
    throw err;
  }
};
