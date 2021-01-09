import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

interface UsersRecommendedSentencesAttributes {
  id?: number;
  userId: number;
  sentenceId: number;
  emotionId: number;
  createdAt?: string;
}

class UsersRecommendedSentences
  extends Model<UsersRecommendedSentencesAttributes>
  implements UsersRecommendedSentencesAttributes {
  public id!: number;
  public userId!: number;
  public sentenceId!: number;
  public emotionId!: number;
  readonly createdAt!: string;
  readonly updatedAt!: Date;
}

UsersRecommendedSentences.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sentenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emotion: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'UsersRecommendedSentences',
  }
);

export default UsersRecommendedSentences;
