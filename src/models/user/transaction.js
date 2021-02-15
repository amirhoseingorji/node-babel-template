import BaseModel from '../BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر',
    },
    user_factorId: {
      type: this.DataTypes.STRING(11),
      desc: 'شناسه فاکتور',
    },
    title: {
      type: this.DataTypes.TEXT,
      desc: 'عنوان',
    },
    price: {
      type: this.DataTypes.INTEGER,
      desc: 'قیمت',
    },
    cash: {
      type: this.DataTypes.INTEGER,
      desc: 'نقدی',
    },
    date: {
      type: this.DataTypes.DATE,
      defaultValue: this.fn('current_timestamp'),
      desc: 'تاریخ',
    },
    cart: {
      type: this.DataTypes.TEXT,
      desc: 'کارت/شماره تراکنش',
    },
    status: {
      type: this.DataTypes.INTEGER,
      desc: 'وضعیت',
    },
    info: {
      type: this.DataTypes.TEXT,
      desc: 'توضیحات',
    },
  };
  paranoid = true;
  info = [
    'id',
    'userId',
    'title',
    'price',
    'cash',
    'date',
    'cart',
    'info',
    'createdAt',
    'updatedAt',
  ];
  status = ['id', 'userId', 'title', 'price', 'cash', 'status'];
  list = this.info;
  searchitems = ['userId', 'title', 'cart'];
  getitems = ['id'];
  additems = ['userId', 'title', 'price', 'cash', 'cart'];
  putitems = ['id', ...this.additems];
}
