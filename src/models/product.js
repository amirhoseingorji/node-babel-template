import BaseModel from './BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    name: {
      type: this.DataTypes.STRING(60),
      desc: 'عنوان',
      allowNull: false,
    },
    off: {
      type: this.DataTypes.INTEGER,
      desc: 'تخفیف',
      allowNull: false,
    },
    price: {
      type: this.DataTypes.INTEGER,
      desc: 'قیمت',
      allowNull: false,
    },
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر',
      allowNull: false,
    },
    description: {
      type: this.DataTypes.TEXT,
      desc: 'توضیحات',
      allowNull: false,
    },
    photo: {
      type: this.DataTypes.TEXT,
      desc: 'تصویر',
      allowNull: false,
    },
    conditions: {
      type: this.DataTypes.TEXT,
      desc: 'شرایط',
      allowNull: false,
    },
  };
  paranoid = true;
}
