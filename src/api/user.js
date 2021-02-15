import jwt from 'jsonwebtoken';
import BaseApi from './BaseApi.js';
import _ from 'lodash';
//todo muset be out of here
import { Joi } from 'celebrate';
const { valid, get, post, put, socket } = BaseApi;
export default class Api extends BaseApi {
  @get
  @socket
  dashboard = async (data) => {
    let { _user } = data;
    let result = { new_registration: 0, active_family: 0, active_user: 0 };
    return result;
  };
  @get
  @socket
  async status(data)  {
    let { _user } = data;
    return await db.user.findOne({
      attributes: db.user.status,
      where: { id: _user },
    });
  };
  @get
  @socket
  info = async (data) => {
    let { _user } = data;
    return await db.user.findOne({
      attributes: db.user.info,
      where: { id: _user },
    });
  };
  @get
  @socket
  relation = async (data) => {
    let { _user: userId } = data;
    let relations = await db.user_relation.findAll({ where: { userId } });
    return relations;
  };
  @get
  @socket
  @valid({
    search: Joi.string().min(3).max(20).description('عبارت جستجو'),
    num: Joi.number().default(20).description('تعداد'),
    page: Joi.number().description('صفحه'),
    order: Joi.string().description('ستون ترتیبی'),
    asc: Joi.valid('ASC', 'DESC').description('صعودی/نزولی'),
  })
  list = async (data) => {
    let { search, num, page, order, asc } = data;
    order = order ? [[order, asc.toUpperCase()]] : [['id', 'ASC']];
    let offset = page && num ? num * (page - 1) : 0;
    let where = { type: 1 };
    if (search) {
      var orlist = [];
      for (let item of db.user.searchitems) {
        let a = {};
        a[item] = { [Op.substring]: search };
        orlist.push(a);
      }
      where = { type: 1, [Op.or]: orlist };
    }
    return await db.user.findAll({
      attributes: db.user.list,
      where,
      order,
      limit: +num || 0,
      offset,
    });
  };
  @get
  logout = async (data) => {
    let { _user, user } = data;
    let now = Math.round(new Date().getTime() / 1000);
    redisclient.set(
      `black_list_${user.iat}`,
      JSON.stringify({ _user, now }),
      'EX',
      user.exp - now,
    );
    return { statusCode: 200 };
  };
  @post
  @valid(_.pick(db.user.validation, db.user.login))
  login = async (data) => {
    let { username, password, _user, user } = data;
    if (_user == '*')
      user = await db.user.findOne({
        attributes: db.user.jwt,
        where: { username, password: fn('md5', password) },
      });
    if (user && user.id > 0) {
      await db.user.update({ is_login: 1 }, { where: { id: user.id } });
      var access_token = jwt.sign({ ...user.dataValues }, privateKey, {
        subject: client,
        expiresIn: access_expire,
        algorithm,
      });
      var refresh_token = jwt.sign({ ...user.dataValues }, privateKey, {
        subject: client,
        expiresIn: refresh_expire,
        algorithm,
      });
      return { access_token, refresh_token };
    } else
      return { statusCode: 403, message: 'نام کاربری و یا رمز عبور صحیح نیست' };
  };
  @post
  @socket
  @valid(_.pick(db.user.validation, db.user.login))
  register = async (data) => {
    let status = await db.user.create(_.pick(data, db.user.additems));
  };
  @post
  @socket
  @valid({
    related_user: Joi.number().required().description('کاربر مرتبط'),
    type: Joi.number().description(
      '  نوع ارتباط: 1:فرزند و 2:پدرمادر و3: خواهربرار و 4: پدر/مادربزرگ و 5 :نوه و 6: سایر',
    ),
  })
  relation = async (data) => {
    let { related_user, _user: userId } = data;
    let status = type < 4 ? 1 : type < 6 ? 2 : 3;
    await db.user_relation.create({ userId, related_user, type, status });
    let related_relations = (status = 1
      ? await db.user_relation.findAll({
          where: { userId: related_user, status: 1 },
        })
      : []);
    let reverse_type =
      type % 3 === 0 ? type : type % 3 === 1 ? type + 1 : type - 1;
    await db.user_relation.create({
      userId: related_user,
      related_user: userId,
      type: reverse_type,
      status,
    });
    for (let relation of related_relations) {
      if (type == 1 && relation.type == 2) {
        //detect bro/sis from parent
        await db.user_relation.create({
          userId,
          related_user: relation.userId,
          type: 3,
          status: 1,
        });
        await db.user_relation.create({
          userId: relation.userId,
          related_user: userId,
          type: 3,
          status: 1,
        });
      }
      if (type == 2 && relation.type == 3) {
        //detect other child from childs bro/sis
        await db.user_relation.create({
          userId,
          related_user: relation.userId,
          type: 2,
          status: 1,
        });
        await db.user_relation.create({
          userId: relation.userId,
          related_user: userId,
          type: 1,
          status: 1,
        });
      }
    }
    return { result: 'ok' };
  };
  @put
  @socket
  @valid(_.pick(db.user.validation, db.user.putitems))
  update = async (data) => {
    let status = await db.user.update(_.pick(data, db.user.putitems), {
      where: { id: data.id },
    });
    return { status };
  };
  // //todo password change
}
