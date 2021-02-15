import fs from 'fs';
export default {
  port: 3001,
  base_path: '/src/api',
  model_path: '/src/models',
  connection: {
    database: 'light_city',
    password: 'it@ndishmand',
    user: '_root',
  },
  ormOptions: {
    define: { freezeTableName: true },
    host: '217.144.104.94',
    dialect: 'mariadb',
  },
  corsOptions: { origin: true },
  uploadOptions: { limits: { fileSize: 50 * 1024 * 1024 } },
  socketOptions: { pingInterval: 10000, pingTimeout: 5000 },
  authOptions: {
    publicKey: fs.readFileSync(process.cwd() + '/public.key'),
    privateKey: fs.readFileSync(process.cwd() + '/private.key'),
    client: 'casheir',
    secret: 'of_asdfasfaSFkdDFSasdfasdflakj',
    algorithm: 'RS512',
    access_expire: '30d',
    refresh_expire: '60d',
  },

  api_variables: {
    user: 'casheir',
    pass: 'light_casheir',
    secret: 'of_asdfasfaSFkdDFSasdfasdflakj',
    baseUrl:
      (process.env.HOMEDRIVE == 'C:'
        ? 'http://localhost:3001'
        : 'https://lighthouse.sitenevis.com') + '/src/api',
  },
  api_info: {
    name: 'light_house' + (process.env.HOMEDRIVE == 'C:' ? '_local' : ''),
    schema:
      'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  api_auth: {
    type: 'oauth2',
    oauth2: [
      {
        key: 'tokenType',
        value: '',
        type: 'string',
      },
      {
        key: 'accessToken',
        value: '',
        type: 'string',
      },
      {
        key: 'headerPrefix',
        value: 'Bearer',
        type: 'string',
      },
      {
        key: 'clientId',
        value: '{{user}}',
        type: 'string',
      },
      {
        key: 'clientSecret',
        value: '{{secret}}',
        type: 'string',
      },
      {
        key: 'client_authentication',
        value: 'header',
        type: 'string',
      },
      {
        key: 'username',
        value: '{{user}}',
        type: 'string',
      },
      {
        key: 'password',
        value: '{{pass}}',
        type: 'string',
      },
      {
        key: 'accessTokenUrl',
        value: '{{baseUrl}}/user/login',
        type: 'string',
      },
      {
        key: 'tokenName',
        value: 'light_token',
        type: 'string',
      },
      {
        key: 'grant_type',
        value: 'password_credentials',
        type: 'string',
      },
      {
        key: 'addTokenTo',
        value: 'header',
        type: 'string',
      },
    ],
  },
  login_auth: {
    type: 'bearer',
    bearer: [
      {
        key: 'token',
        value: 'Y2FzaGVpcjpvZl9hc2RmYXNmYVNGa2RERlNhc2RmYXNkZmxha2o=',
        type: 'string',
      },
    ],
  },
};
