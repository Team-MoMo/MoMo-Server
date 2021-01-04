import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';

interface DiaryAttributes {
  id: number;
  contents: string;
  position: number;
  depth: number;
  userId: number;
  sentenceId: number;
  emotionId: number;
  createdAt?: Date;
}

interface DiaryCreationAttributes extends Optional<DiaryAttributes, 'id'> {}

class Diary extends Model<DiaryAttributes, DiaryCreationAttributes> implements DiaryAttributes {
  public id!: number;
  public contents!: string;
  public position!: number;
  public depth!: number;
  public userId!: number;
  public sentenceId!: number;
  public emotionId!: number;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

Diary.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    depth: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    contents: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sentenceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    emotionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Diaries',
  }
);

export default Diary;
