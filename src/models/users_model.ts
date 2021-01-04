import { Model, DataTypes, Association } from 'sequelize';
import Diary from './diaries_model';
import { sequelize } from './index';
import Notification from './notifications_model';

interface UserAttributes {
  id?: number;
  email: string;
  password: string;
  passwordSalt?: string;
  isAlarmSet?: boolean;
  alarmTime?: Date | null;
  tempPassword?: string | null;
  tempPasswordCreatedAt?: Date | null;
  tempPasswordIssueCount?: number;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  public email!: string;
  public password!: string;
  public passwordSalt!: string;
  public isAlarmSet!: boolean;
  public alarmTime!: Date | null;
  public tempPassword!: string | null;
  public tempPasswordCreatedAt!: Date | null;
  public tempPasswordIssueCount!: number;

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
    tempPassword: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tempPasswordCreatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tempPasswordIssueCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    tableName: 'Users',
    sequelize,
  }
);

export default User;
