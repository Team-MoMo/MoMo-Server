import { Model, DataTypes, Association, Optional } from 'sequelize';
import Diary from './diaries_model';

import { sequelize } from './index';
import Notification from './notifications_model';

interface UserAttributes {
  id: number;
  email: string;
  password: string;
  passwordSalt: string;
  name: string;
  isAlarmSet?: boolean;
  alarmTime?: Date | null;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public passwordSalt!: string;
  public name!: string;
  public isAlarmSet!: boolean;
  public alarmTime!: Date | null;

  // timestamps!
  readonly createdAt!: Date;
  readonly updatedAt!: Date;

  static associations: {
    diaries: Association<User, Diary>;
    notifications: Association<User, Notification>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    passwordSalt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isAlarmSet: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    alarmTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },
  },
  {
    tableName: 'Users',
    sequelize,
  }
);

export default User;
