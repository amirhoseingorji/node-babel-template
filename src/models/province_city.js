import BaseModel from './BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    provinceId: {
      type: this.DataTypes.INTEGER.UNSIGNED,
      desc: 'شناسه استان',
    },
    name: {
      type: this.DataTypes.STRING(200),
      desc: 'نام',
    },
    province: {
      type: this.DataTypes.STRING(60),
      desc: 'نام استان',
    },
  };
  timestamps = false;
  ///
  // info = ["name", ["email", "mu"]]
}
