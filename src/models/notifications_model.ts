import { Model, DataTypes } from 'sequelize';
import { sequelize } from './index';

interface NotificationAttributes {
  id?: number;
  deviceToken: string;
  userId: number;
}

class Notification extends Model<NotificationAttributes> implements NotificationAttributes {
  public id!: number;
  public deviceToken!: string;
  public userId!: number;

  readonly createdAt!: Date;
  readonly updatedAt!: Date;
}

Notification.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    deviceToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'Notifications',
  }
);

export default Notification;
