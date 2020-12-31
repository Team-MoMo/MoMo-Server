import Emotion from '../models';

export const readAll = async () => {
  try {
    const emotions = await Emotion.Emotion.findAll();
    return emotions;
  } catch (err) {
    throw err;
  }
};
