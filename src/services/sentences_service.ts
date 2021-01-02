import model from '../models';

export const readAll = async (emotionId: any) => {
  try {
    const sentences: object = await model.Sentence.findAll({
      attributes: ['id', 'contents', 'writer', 'publisher', 'emotionId'],
      where: {
        emotionId,
      },
    });
    return sentences;
  } catch (err) {
    throw err;
  }
};
