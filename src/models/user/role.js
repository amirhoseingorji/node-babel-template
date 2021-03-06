import BaseModel from '../BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    name: {
      type: this.DataTypes.INTEGER,
      desc: 'عنوان',
    },
    conditions: {
      type: this.DataTypes.TEXT,
      desc: 'شرایط',
    },
  };
  paranoid = true;
}
