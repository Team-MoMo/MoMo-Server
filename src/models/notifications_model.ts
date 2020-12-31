import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from './index';

interface NotificationAttributes {
  id: number;
  deviceToken: string;
  userId: number;
}

interface NotificationCreationAttributes extends Optional<NotificationAttributes, 'id'> {}

class Notification
  extends Model<NotificationAttributes, NotificationCreationAttributes>
  implements NotificationAttributes {
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
      type: DataTypes.STRING(255),
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
