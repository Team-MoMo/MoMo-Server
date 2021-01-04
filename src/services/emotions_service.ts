import model from '../models';
import Emotion from '../models/emotions_model';

export const readAll = async () => {
  try {
    const emotions = await model.Emotion.findAll();
    return emotions;
  } catch (err) {
    throw err;
  }
};
