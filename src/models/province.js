import BaseModel from './BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    name: {
      type: this.DataTypes.STRING(100),
      desc: 'نام',
    },
  };
  timestamps = false;
  ///
  // info = ["name", ["email", "mu"]]
}
