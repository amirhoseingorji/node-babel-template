import glob from 'glob';
import { celebrate, Joi, errors, Segments, CelebrateError } from 'celebrate';
import simpleGit from 'simple-git';
import { exec } from 'child_process';
import util from 'util';
const aexec = util.promisify(exec);
const methods = ["GET", "POST", "DELETE", "OPTIONS", "PUT", "PATCH", "COPY", "HEAD", "SOCKET"];
export default class Api_loader {
  async init(params) {
    let { app, io, base_path, shared } = params;
    this.shared = shared;
    this.base_path = base_path;
    if (!app) return console.log('app is not presented');
    let api = await this.api_importer(process.cwd() + base_path);
    this.api_postman_items = [];
    app.get(this.base_path + '/postman', async (req, res) => {
      let item = this.api_postman_items; //[await this.api_postman(base_path)]
      let variable = [];
      for (let i in shared.api_variables)
        variable.push({
          key: i,
          value: shared.api_variables[i],
          type: 'string',
        });
      res.send({ info: shared.api_info, item, variable });
    });
    app.get(this.base_path + '/git', async (req, res) => {
      const git = simpleGit({
        baseDir: process.cwd(),
        binary: 'git',
        maxConcurrentProcesses: 6,
      });
      let { files } = await git.pull('origin', 'master');
      if (files.join(',').indexOf('package.json') > -1)
        await aexec('npm i --save');
      res.send('pull and restart succesfully');
      await aexec('pm2 restart ' + process.env.name);
    });
    for (let path in api) {
      let api_item = new api[path](
        { ...shared, Joi },
        path.slice(base_path.length),
      );
      await this.app_loader(app,api_item, path);
      if (io) {
        let io_space = io.of(base_path);
        io_space.use(this.socket_loader(api_item, path));
      }
    }

    //app.use(this.error("خطای ورود اطلاعات"),errors({statusCode: 400}))
    app.use((req, res, next) => next(new CelebrateError(null)));
    app.use(this.error('این روال موجود نیست'), errors({ statusCode: 404 }));
  }
  error = (msg) => (err, req, res, next) => {
    let nerr = new CelebrateError(msg, { celebrated: true });
    nerr.details = err ? err.details : null;
    next(err ? nerr : null);
  };
  messages = {
    // "any.invalid" : '{#label} معتبر نیست',
    // "string.base" : '{#label} فرمت مناسبی ندارد',
    // "string.max": '{#label} از حد مجاز طولانی تر است',
    // 'string.empty': '{#label} نمی تواند خالی باشد',
    // 'any.required': '{#label} می بایست ارسال شود'
  };
  api_importer = async (dir, reculsive = false) => {
    return new Promise((resolve) => {
      glob(dir + '/**/*.js', async (err, files) => {
        let obj = {};
        for (let file of files) {
          let rpath = file.split(' ').join('_').split('/');
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
            obj[file.slice(process.cwd().length + 1).split('.js')[0]] = (
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
  app_loader = async (app, api, path) => {
    app.use(async (req, res, next) => {
      req.body = { ...req.body, ...req.files };
      req.data = { ...req.query, ...req.body };
      next();
    });
    if (api.auth) {
      app.all(
        `/${path}/*`,
        async (req, res, next) => {
          let authorization = (req.headers.authorization || '').split(' ')[1];
          var user = await api.auth(
            authorization,
            req.url.split('?')[0].split('/').pop(),
          );
          if (!user.authorization) {
            let validation = Joi.object({
              access_token: Joi.string().required(),
              authorization: Joi.valid(true).required(),
            })
              .unknown()
              .messages(this.messages)
              .validate({ access_token: authorization, ...user });
            const err = new CelebrateError(null);
            err.details.set(Segments.HEADERS, validation.error);
            return next(err);
          }
          req.data = { ...req.data, _user: user.id, user };
          next();
        },
        this.error('کد شناسایی ارتباطی معتبر نیست'),
        errors({ statusCode: 401 }),
      );
    }
    let methods = [
      'GET',
      'POST',
      'DELETE',
      'OPTIONS',
      'PUT',
      'PATCH',
      'COPY',
      'HEAD',
    ];
    for (let method of methods)
      for (let apii in api[method]) {
        let validation = await api[method][apii].validators;

        app[method.toLocaleLowerCase()](
          `/${path}/${apii.replace('_', '/')}`,
          celebrate({
            [method == 'GET' ? Segments.QUERY : Segments.BODY]: Joi.object(validation).unknown().messages(this.messages),
          }),
          this.error('خطای ورود اطلاعات'),
          errors({ statusCode: 400 }),
          async (req, res, next) => {

            let result = await api[method][apii](req.data, req.files);
          
            if (!result) return next();
            if (result.statusCode)
              return res
                .status(result.statusCode)
                .send({
                  statusCode: 403,
                  error: 'Forbidden',
                  message: 'خطای نامشخص',
                  validation: {},
                  ...result,
                });
            if (result.header)
              for (let key in result.header) res.set(key, result.header[key]);
            if (result.file) return res.sendFile(result.file);
            if (result.redirect) return res.redirect(result.redirect);

            res.send(result);
          },
        );
      }
    if (api.postman)
      this.api_postman_items.push(
        await api.postman(path.slice(this.base_path.length)),
      );
  };
  //todo important recheck
  socket_loader = (api, path) => async (
    socket,
    next,
    user = { id: 0 },
    authorization = '',
    _error,
  ) => {
    let spath = path.split('/').slice(1).join('/');
    if (api.auth) {
      if (socket.handshake.headers.authorization == undefined) return next();
      authorization = socket.handshake.headers.authorization.split(' ')[1];
      user = await api.auth(authorization);
      if (!user.id)
        _error = { statusCode: 401, error: 'کد شناسایی ارتباطی معتبر نیست' };
    }
    let methods = [
      'GET',
      'POST',
      'DELETE',
      'OPTIONS',
      'PUT',
      'PATCH',
      'COPY',
      'HEAD',
    ];
    for (let method of methods)
      for (let apii in api[method]) {
        socket.on(
          `${method}:${spath}/${apii.replace('_', '/')}`.toLowerCase(),
          async (data, callback) => {
            callback(
              _error
                ? _error
                : await api[method][apii]({ ...data, _user: user.id, user }),
            );
          },
        );
      }
    next();
  };
}
