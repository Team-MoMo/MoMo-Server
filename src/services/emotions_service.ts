import model from '../models';
import Emotion from '../models/emotions_model';

export const readAll = async () => {
  const emotions: Emotion[] = await model.Emotion.findAll();
  return emotions;
};
