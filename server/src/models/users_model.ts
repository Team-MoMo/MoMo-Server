import { Model, DataTypes, Association } from 'sequelize';
import Diary from './diaries_model';
import UsersRecommendedSentence from './users_recommended_sentences_model';
import notification from './notifications_model';

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
  isDeleted?: boolean | null;
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
  public exportationCount!: number;
  public exportedAt!: Date;
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
      defaultValue: '22:00',
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
    exportationCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    exportedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
    },
  },
  {
    tableName: 'Users',
    paranoid: true,
    sequelize,
    indexes: [{ unique: true, fields: ['email', 'isDeleted'] }],
    hooks: {
      afterDestroy: async (user, option) => {
        await user.update({
          isDeleted: null,
        });

        await Diary.destroy({
          where: {
            userId: user.get('id'),
          },
        });

        await UsersRecommendedSentence.destroy({
          where: {
            userId: user.get('id'),
          },
        });

        await Notification.destroy({
          where: {
            userId: user.get('id'),
          },
        });
      },
    },
  }
);

export default User;
