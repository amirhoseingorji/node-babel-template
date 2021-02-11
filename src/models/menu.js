import BaseModel from './BaseModel.mjs';

export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.TEXT,
      allowNull: false,
      desc: 'شناسه کابر',
    },
    $id: {
      type: this.DataTypes.STRING(60),
      desc: 'شناسه2',
    },
    $pid: {
      type: this.DataTypes.STRING(60),
      desc: 'والد',
    },
    menu: {
      type: this.DataTypes.INTEGER,
      desc: 'نمایش',
      allowNull: false,
      defaultValue: 1,
    },
    target: {
      type: this.DataTypes.STRING(60),
      desc: 'تارگت',
    },
    title: {
      type: this.DataTypes.STRING(60),
      desc: 'عنوان',
    },
    text: {
      type: this.DataTypes.TEXT,
      desc: 'توضیح',
    },
    iconCls: {
      type: this.DataTypes.STRING(60),
      desc: 'آیکون',
    },
  };
  timestamps = false;
  // info = ["name", ["email", "mu"]]
}
