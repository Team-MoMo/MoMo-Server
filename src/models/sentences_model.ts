import { Model, DataTypes, Association } from 'sequelize';
import { sequelize } from './index';
import Diary from './diaries_model';

interface SentenceAttributes {
  id?: number;
  contents: string;
  bookName: string;
  writer: string;
  publisher: string;
}

class Sentence extends Model<SentenceAttributes> implements SentenceAttributes {
  public id!: number;
  public contents!: string;
  public bookName!: string;
  public writer!: string;
  public publisher!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  public static associations: {
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
    bookName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    writer: {
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
  },
  {
    sequelize,
    tableName: 'Sentences',
  }
);

export default Sentence;
