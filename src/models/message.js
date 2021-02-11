import BaseModel from './BaseModel.mjs';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کابر',
    },
    serviceId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه سرویس',
    },
    mobile: {
      type: this.DataTypes.STRING(20),
      desc: 'شماره',
    },
    text: {
      type: this.DataTypes.TEXT,
      desc: 'متن',
    },
    link: {
      type: this.DataTypes.STRING(60),
      desc: 'لینگ',
    },
    type: {
      type: this.DataTypes.INTEGER,
      desc: 'نوع',
    },
  };
  paranoid = true;
}
