import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

interface UsersRecommendedSentencesAttributes {
  id?: number;
  userId: number;
  sentenceId: number;
  emotionId: number;
  isDeleted?: boolean | null;
  createdAt?: string;
}

class UsersRecommendedSentences
  extends Model<UsersRecommendedSentencesAttributes>
  implements UsersRecommendedSentencesAttributes {
  public id!: number;
  public userId!: number;
  public sentenceId!: number;
  public emotionId!: number;
  public isDeleted!: boolean | null;
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
      allowNull: true,
    },
    emotionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    sequelize,
    paranoid: true,
    tableName: 'UsersRecommendedSentences',
    indexes: [{ unique: true, fields: ['userId', 'sentenceId', 'isDeleted'] }],
    hooks: {
      beforeBulkDestroy: async (option) => {
        option.individualHooks = true;
      },
      afterDestroy: async (usersRecommendedSentences, option) => {
        await usersRecommendedSentences.update({
          isDeleted: null,
        });
      },
    },
  }
);

export default UsersRecommendedSentences;
