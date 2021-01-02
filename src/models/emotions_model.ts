import { Model, DataTypes, HasManyGetAssociationsMixin, Association, Optional } from 'sequelize';
import { sequelize } from './index';
import Sentence from './sentences_model';
import Diary from './diaries_model';

interface EmotionAttributes {
  id: number;
  name: string;
}

interface EmotionCreationAttributes extends Optional<EmotionAttributes, 'id'> {}

class Emotion extends Model<EmotionAttributes, EmotionCreationAttributes> implements EmotionAttributes {
  public id!: number;
  public name!: string;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;

<<<<<<< HEAD
=======
  getSentence!: HasManyGetAssociationsMixin<Sentence>;
  public readonly sentences?: Sentence[];

>>>>>>> Fix: 오타 수정
  static associations: {
    sentences: Association<Emotion, Sentence>;
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
