import BaseModel from './BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    userId: {
      type: this.DataTypes.INTEGER,
      desc: 'َشناسه کاربری',
    },
    filepath: {
      type: this.DataTypes.TEXT,
      desc: 'مسیر',
    },
    thumbnail: {
      type: this.DataTypes.TEXT,
      desc: 'بندانگشتی',
      allowNull: true,
    },
    width: {
      type: this.DataTypes.INTEGER,
      desc: 'عرض',
      allowNull: true,
    },
    height: {
      type: this.DataTypes.INTEGER,
      desc: 'ارتفاع',
      allowNull: true,
    },
    duration: {
      type: this.DataTypes.INTEGER,
      desc: 'ارتفاع',
      allowNull: true,
    },
    type: {
      type: this.DataTypes.INTEGER,
      desc: 'نوع',
    },
    status: {
      type: this.DataTypes.INTEGER,
      desc: 'وضعیت',
      allowNull: true,
      defaultValue: 0,
    },
  };
  indexes = [{ unique: true, fields: ['path'] }];
  paranoid = true;
  ///
  getitems = ['id'];
  additems = [
    'filepath',
    'userId',
    'thumbnail',
    'height',
    'width',
    'duration',
    'type',
  ];
  info = [
    'id',
    'filepath',
    'thumbnail',
    'height',
    'width',
    'duration',
    'type',
    'status',
  ];
}
