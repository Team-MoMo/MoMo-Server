import { Model, DataTypes, HasManyGetAssociationsMixin, Association, Optional } from 'sequelize';
import { sequelize } from './index';
import Sentence from './sentence';
import Diary from './diary';

interface EmotionAttributes {
  id: number;
  name: string;
}

interface EmotionCreationAttributes extends Optional<EmotionAttributes, 'id'> {}

class Emotion
  extends Model<EmotionAttributes, EmotionCreationAttributes>
  implements EmotionAttributes {
  public id!: number;
  public name!: string;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  getSentence!: HasManyGetAssociationsMixin<Sentence>;
  public readonly senetences?: Sentence[];

  static associations: {
    senetences: Association<Emotion, Sentence>;
    diaries: Association<Emotion, Diary>;
  };
}

Emotion.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(10),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Emotions',
  }
);

export default Emotion;
