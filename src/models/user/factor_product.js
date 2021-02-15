import BaseModel from '../BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربری',
    },
    user_factorId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه فاکتور',
    },
    productId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه خدمات',
    },
    count: {
      type: this.DataTypes.INTEGER,
      desc: 'تعداد',
    },
    unit: {
      type: this.DataTypes.INTEGER,
      desc: 'واحد',
    },
    off: {
      type: this.DataTypes.INTEGER,
      desc: 'تخفیف',
    },
    price: {
      type: this.DataTypes.INTEGER,
      desc: 'قیمت',
    },
    description: {
      type: this.DataTypes.INTEGER,
      desc: 'توضیحات',
    },
  };
  paranoid = true;
}
