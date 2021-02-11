// module.exports = {
//   env: {
//     es2021: true,
//   },
//   extends: ['airbnb-base', 'prettier'],
//   parserOptions: {
//     ecmaVersion: 7,
//     "ecmaFeatures": {
//       "experimentalObjectRestSpread": true,
//       "experimentalDecorators": true,
//       "jsx": true
//      },
//     sourceType: 'module',
//   },
//   settings: {
//     'import/resolver': {
//       'babel-module': {},
//     },
//   },
// };
module.exports ={
  "parser": "babel-eslint",
  "parserOptions": {
      "ecmaVersion": 7,
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "experimentalDecorators": true,
          "jsx": true
      },
      "sourceType": "module"
  },
  "ecmaFeatures": {
      "es6" : true,
      "airbnb": true
  },
  "rules": {
      "semi": 2
  }
}