import { Model, DataTypes, Association } from 'sequelize';
import { sequelize } from './index';
import Diary from './diaries_model';

interface EmotionAttributes {
  id?: number;
  name?: string;
}

class Emotion extends Model<EmotionAttributes> implements EmotionAttributes {
  public id!: number;
  public name!: string;
  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  static associations: {
    diaries: Association<Emotion, Diary>;
  };
}

Emotion.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Emotions',
  }
);

export default Emotion;
