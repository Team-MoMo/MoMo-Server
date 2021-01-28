import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

interface EmotionsHaveSentencesAttributes {
  id?: number;
  sentenceId: number;
  emotionId: number;
}

class EmotionsHaveSentences extends Model<EmotionsHaveSentencesAttributes> implements EmotionsHaveSentencesAttributes {
  public id!: number;
  public sentenceId!: number;
  public emotionId!: number;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

EmotionsHaveSentences.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sentenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emotionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    paranoid: true,
    tableName: 'EmotionsHaveSentences',
  }
);

export default EmotionsHaveSentences;
