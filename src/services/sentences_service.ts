import model from '../models';

export const readAll = async () => {
  try {
    const sentences = await model.Sentence.findAll();
    return sentences;
  } catch (err) {
    throw err;
  }
};
