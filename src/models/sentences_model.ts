import { Model, DataTypes, Association, Optional } from 'sequelize';

import { sequelize } from './index';
import Diary from './diaries_model';

interface SentenceAttributes {
  id: number;
  contents: string;
  writer: string;
  publisher: string;
  emotionId: number;
}

interface SentenceCreationAttributes extends Optional<SentenceAttributes, 'id'> {}

class Sentence extends Model<SentenceAttributes, SentenceCreationAttributes> implements SentenceAttributes {
  public id!: number;
  public contents!: string;
  public writer!: string;
  public publisher!: string;
  public emotionId!: number;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  static associations: {
    diaries: Association<Sentence, Diary>;
  };
}

Sentence.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    contents: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    writer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    publisher: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emotionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Sentences',
  }
);

export default Sentence;