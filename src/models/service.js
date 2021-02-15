import BaseModel from './BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    name: {
      type: this.DataTypes.STRING(60),
      desc: 'نام',
    },
    type: {
      type: this.DataTypes.INTEGER,
      desc: 'نوع',
    },
    token: {
      type: this.DataTypes.STRING(120),
      desc: 'توکن',
    },
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر',
    },
    username: {
      type: this.DataTypes.STRING(120),
      desc: 'نام کابری',
    },
    password: {
      type: this.DataTypes.STRING(120),
      desc: 'رمز',
    },
    url: {
      type: this.DataTypes.STRING(256),
      desc: 'آدرس',
    },
  };
  paranoid = true;
}
