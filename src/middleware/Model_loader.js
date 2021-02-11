import glob from 'glob';
import { Joi } from 'celebrate';
export default class Model_loader {
  async init(params) {
    var { model_path, sequelize, DataTypes, fn, sync } = params;
    let models = await this.importer(process.cwd() + model_path);
    let cJoi = {
      INTEGER: 'number',
      TEXT: 'string',
      STRING: 'string',
      DATE: 'date',
    };
    for (let model in models) {
      let { indexes, timestamps, createdAt, updatedAt, paranoid } = models[
        model
      ];
      let params = { indexes, timestamps, createdAt, updatedAt, paranoid };
      models[model] = new models[model](DataTypes, fn);
      let ormobj = sequelize.define(model, models[model].schema, params);
      delete models[model].types;

      let validation = {};
      for (let item in models[model].schema) {
        let { type, allowNull, desc, defaultValue, validate } = models[
          model
        ].schema[item];
        let validation_item = Joi.any();

        if (type) {
          validation_item = Joi[cJoi[type.key]]();
          if (type._length) validation_item = validation_item.max(type._length);
        }
        if (validate) {
          let {
            is,
            isIn,
            notIn,
            not,
            isEmail,
            isUrl,
            isIp,
            isAlpha,
            isFloat,
            isInt,
            isNumeric,
            isAlphanumeric,
            isDate,
            max,
            min,
            len,
            isDecimal,
            isLowercase,
            isUppercase,
            notEmpty,
            equals,
          } = validate;
          //todo not implemented
          if (equals) validation_item = validation_item.validate(equals);
          else if (isIn) validation_item = validation_item.valid(...isIn);
          else if (notIn) validation_item = validation_item.invalid(...notIn);
          else if (is) validation_item = validation_item.regex(is);
          else if (not)
            validation_item = validation_item.regex(not, { invert: true });
          else if (isInt) validation_item = validation_item.integer();
          else if (isFloat || isNumeric)
            validation_item = validation_item.float();
          else if (isDecimal)
            validation_item = validation_item.float().regex(/^[0-9]*\.[0-9]*$/);
          else if (isIp)
            validation_item = validation_item.ip({
              version: ['ipv4', 'ipv6'],
              cidr: 'required',
            });
          else if (isUrl) validation_item = validation_item.uri();
          else if (isAlpha)
            validation_item = validation_item.regex(/^[a-zA-Z0-9_]*$/);
          else if (isAlphanumeric) validation_item = validation_item.alphanum();
          else if (isEmail) validation_item = validation_item.email();
          else if (isDate) validation_item = validation_item.date();
          else if (isLowercase) validation_item = validation_item.lowercase();
          else if (isUppercase) validation_item = validation_item.uppercase();
          if (!allowNull) validation_item = validation_item.invalid(null);
          if (len)
            validation_item = validation_item
              .max(max ? Math.min(max, len[1]) : len[1])
              .min(Math.max(notEmpty ? 1 : 0, min, len[0]));
          else {
            if (min || notEmpty)
              validation_item = validation_item.min(
                Math.max(notEmpty ? 1 : 0, min),
              );
            if (max) validation_item = validation_item.max(max);
          }
        }
        if (!allowNull) validation_item = validation_item.required();
        if (defaultValue !== undefined)
          validation_item = validation_item.default(defaultValue);
        if (desc) validation_item = validation_item.description(desc);
        validation[item] = validation_item;
      }
      for (let item in models[model]) ormobj[item] = models[model][item];
      ormobj.validation = validation;
      models[model] = ormobj;
    }
    if (sync) await sequelize.sync(sync);
    return models;
  }
  importer = async (dir, reculsive = false) => {
    return new Promise((resolve) => {
      glob(dir + '/**/*.js', async (err, files) => {
        let obj = {};
        for (let file of files) {
          let rpath = file
            .slice(dir.length + 1)
            .split(' ')
            .join('_')
            .split('/');
          if (reculsive) {
            let add = {};
            let destobj = add;
            for (let i = 1; i < rpath.length - 1; i++) {
              destobj[rpath[i]] = {};
              destobj = destobj[rpath[i]];
            }
            destobj[rpath.slice(-1)[0].split('.js')[0]] = (
              await import(file)
            ).default;
            obj = { ...obj, ...add };
          } else {
            obj[
              file
                .slice(dir.length + 1)
                .split('.js')[0]
                .split('/')
                .join('_')
            ] = (
              await import(
                (process.env.HOMEDRIVE == 'C::' ? 'file:///' : '') + file
              )
            ).default;
          }
        }
        resolve(obj);
      });
    });
  };
}
