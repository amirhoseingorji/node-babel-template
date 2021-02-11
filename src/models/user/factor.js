import BaseModel from '../BaseModel.mjs';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه کاربر',
    },
    title: {
      type: this.DataTypes.STRING(60),
      desc: 'عنوان',
    },
    offcodeId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه تخفیف',
    },
    sumprice: {
      type: this.DataTypes.INTEGER,
      desc: 'جمع',
    },
    offprice: {
      type: this.DataTypes.INTEGER,
      desc: 'تخفیف',
      defaultValue: 0,
    },
    vatprice: {
      type: this.DataTypes.INTEGER,
      desc: 'مالیات',
      defaultValue: 0,
    },
    payprice: {
      type: this.DataTypes.INTEGER,
      desc: 'پرداخت شده',
    },
    user_transactionId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه پرداخت',
    },
    user_addresId: {
      type: this.DataTypes.INTEGER,
      desc: 'شناسه آدرس',
    },
  };
  paranoid = true;
}
