import BaseModel from './BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر',
    },
    code: {
      type: this.DataTypes.STRING(20),
      desc: 'کد تخفیف',
      unique: 'code',
    },
    percent: {
      type: this.DataTypes.INTEGER,
      desc: 'درصد',
    },

    total: {
      type: this.DataTypes.INTEGER,
      desc: 'همه',
    },
    used: {
      type: this.DataTypes.INTEGER,
      desc: 'مصرف',
    },
    maxprice: {
      type: this.DataTypes.INTEGER,
      desc: 'حداکثر',
    },
    sumprice: {
      type: this.DataTypes.INTEGER,
      desc: 'جمع',
    },
    expire: {
      type: this.DataTypes.DATE,
      desc: 'انقضا',
    },
    description: {
      type: this.DataTypes.TEXT,
      desc: 'توضیح',
    },
    conditions: {
      type: this.DataTypes.TEXT,
      desc: 'شرایط',
    },
  };
  paranoid = true;
}
