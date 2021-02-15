import BaseModel from '../BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر',
    },
    type: {
      type: this.DataTypes.STRING(128),
      desc: 'نوع',
    },
    value: {
      type: this.DataTypes.TEXT,
      desc: 'مقدار',
      allowNull: true,
    },
    status: {
      type: this.DataTypes.INTEGER,
      desc: 'وضعیت',
      allowNull: false,
      defaultValue: 0,
    },
  };
  list = ['id', 'userId', 'type', 'value', 'status', 'createdAt'];
  searchitems = ['type', 'value'];
}
