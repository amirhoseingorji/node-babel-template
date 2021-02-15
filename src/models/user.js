import BaseModel from './BaseModel';
export default class User extends BaseModel {
  schema = {
    ...this.schema,
    username: {
      type: this.DataTypes.STRING(60),
      unique: 'username',
      desc: 'نام کاربری',
      defaultValue: '{{user}}',
    },

    password: {
      type: this.DataTypes.STRING(256),
      desc: 'رمز عبور',
      defaultValue: '{{pass}}',
    },
    national_id: {
      type: this.DataTypes.STRING(10),
      desc: 'کد ملی',
      allowNull: true,
    },
    type: {
      type: this.DataTypes.INTEGER,
      desc: 'نوع',
    },
    name: {
      type: this.DataTypes.STRING(40),
      desc: 'نام',
      allowNull: true,
    },
    family: {
      type: this.DataTypes.STRING(40),
      desc: 'فامیلی',
      allowNull: true,
    },
    birthdate: {
      type: this.DataTypes.DATE,
      desc: 'نوع',
      allowNull: true,
    },
    age: {
      type: this.DataTypes.INTEGER,
      desc: 'سن',
      allowNull: true,
    },
    gender: {
      type: this.DataTypes.INTEGER,
      desc: 'جنس',
      defaultValue: 34,
      allowNull: true,
    },
    mobile: {
      type: this.DataTypes.STRING(20),
      desc: 'همراه',
      allowNull: true,
    },
    photo_thumbnail: {
      type: this.DataTypes.STRING(512),
      desc: 'تصویرک',
      allowNull: true,
    },

    credit: {
      type: this.DataTypes.INTEGER,
      desc: 'اعتبار',
      allowNull: true,
      defaultValue: 0,
    },
    gift: {
      type: this.DataTypes.INTEGER,
      desc: 'اعتبار هدیه',
      allowNull: true,
      defaultValue: 0,
    },
    payed: {
      type: this.DataTypes.INTEGER,
      desc: 'پرداخت شده',
      allowNull: true,
      defaultValue: 0,
    },
    gifted: {
      type: this.DataTypes.INTEGER,
      desc: 'جمع غیرنقدی',
      allowNull: true,
      defaultValue: 0,
    },
    confirm: {
      type: this.DataTypes.INTEGER,
      desc: 'تایید',
      defaultValue: 0,
    },
    status: {
      type: this.DataTypes.INTEGER,
      desc: 'وضعیت',
      allowNull: true,
      defaultValue: 0,
    },
    level: {
      type: this.DataTypes.INTEGER,
      desc: 'سطح',
      allowNull: true,
      defaultValue: 0,
    },
    score: {
      type: this.DataTypes.INTEGER,
      desc: 'امتیاز',
      allowNull: true,
      defaultValue: 0,
    },
    user_group: {
      type: this.DataTypes.STRING(120),
      allowNull: true,
      desc: 'گروه',
    },
    user_role: {
      type: this.DataTypes.STRING(40),
      allowNull: true,
      desc: 'نقش',
    },
    email: {
      type: this.DataTypes.STRING(120),
      allowNull: true,
      desc: 'ایمیل',
    },
    shaba: {
      type: this.DataTypes.INTEGER,
      allowNull: true,
      desc: 'شبا',
    },
    tel: {
      type: this.DataTypes.INTEGER,
      allowNull: true,
      desc: 'تلفن',
    },
    is_login: {
      type: this.DataTypes.INTEGER,
      allowNull: true,
      desc: 'لاگین',
      defaultValue: 0,
    },
    is_parent: {
      type: this.DataTypes.INTEGER,
      desc: 'سرپرست',
      defaultValue: 0,
    },

    description: {
      type: this.DataTypes.TEXT,
      desc: 'توضیحات',
      allowNull: true,
    },
  };

  indexes = [{ unique: true, fields: ['username'] }];
  paranoid = true;
  ///
  info = [
    'id',
    'username',
    'type',
    'name',
    'family',
    'birthdate',
    'age',
    'gender',
    'mobile',
    'credit',
    'gift',
    'payed',
    'gifted',
    'confirm',
    'createdAt',
    'updatedAt',
    'status',
    'level',
    'score',
    'user_group',
    'user_role',
    'email',
    'shaba',
    'tel',
    'description',
    'is_parent',
  ];
  status = [
    'id',
    'username',
    'type',
    'name',
    'family',
    'status',
    'gender',
    'national_id',
    'photo_thumbnail',
    'is_parent',
  ];
  jwt = ['id', 'username', 'type', 'status'];
  list = [
    'id',
    'name',
    'status',
    'age',
    'gender',
    'mobile',
    'national_id',
    'credit',
    'gift',
    'level',
    'score',
    'createdAt',
    'updatedAt',
  ];
  searchitems = ['name', 'family', 'national_id', 'mobile'];
  login = ['username', 'password'];
  additems = [
    'name',
    'family',
    'birthdate',
    'gender',
    'mobile',
    'national_id',
    'description',
    'is_parent',
  ];
  putitems = [
    'id',
    'name',
    'family',
    'birthdate',
    'gender',
    'mobile',
    'national_id',
    'description',
    'is_parent',
  ];
}
