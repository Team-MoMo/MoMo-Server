import { Model, DataTypes, Association, Optional } from 'sequelize';

import { sequelize } from './index';
import Diary from './diary';

interface SentenceAttributes {
  id: number;
  contents: string;
  writer: string;
  publisher: string;
  emotionId: number;
}

interface SentenceCreationAttributes extends Optional<SentenceAttributes, 'id'> {}

class Sentence
  extends Model<SentenceAttributes, SentenceCreationAttributes>
  implements SentenceAttributes {
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
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    contents: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    writer: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    publisher: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    emotionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Sentences',
  }
);

export default Sentence;
