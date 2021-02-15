import BaseModel from '../BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    name: {
      type: this.DataTypes.STRING(120),
      desc: 'عنوان',
    },
    type: {
      type: this.DataTypes.INTEGER,
      desc: 'نوع',
    },
  };
}
