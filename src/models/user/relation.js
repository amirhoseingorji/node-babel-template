import BaseModel from '../BaseModel.mjs';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر',
    },
    related_userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر مرتبط',
    },
    type: {
      type: this.DataTypes.INTEGER,
      desc: 'نوع',
    },
    status: {
      type: this.DataTypes.INTEGER,
      desc: 'وضعیت',
    },
    description: {
      type: this.DataTypes.STRING(512),
      desc: 'توضیحات',
    },
  };
  paranoid = true;
}
