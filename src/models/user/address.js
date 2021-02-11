import BaseModel from '../BaseModel.mjs';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    ord: {
      type: this.DataTypes.INTEGER,
      desc: 'ترتیب',
    },
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر',
    },
    provinceId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه استان',
    },
    province_cityId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه شهر',
    },
    lat: {
      type: this.DataTypes.INTEGER,
      desc: 'طول',
    },
    lang: {
      type: this.DataTypes.INTEGER,
      desc: 'عرض',
    },
    text: {
      type: this.DataTypes.TEXT,
      desc: 'آدرس',
    },
  };
  paranoid = true;
}
