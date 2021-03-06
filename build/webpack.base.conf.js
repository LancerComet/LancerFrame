const path = require('path')
const resolver = filepath => path.resolve(__dirname, '../' + filepath)

const isProd = process.env.NODE_ENV === 'production'
const srcFolders = ['dev', 'src', 'test'].map(resolver)

const babelConfig = require('../babelrc.json')

if (!isProd) {
  babelConfig.plugins = ["transform-runtime"]
}

const rules = [
  {
    test: /\.tsx?$/,
    loader: 'tslint-loader',
    enforce: 'pre',
    exclude: /node_modules/,
    options: require('./tslint.conf')
  },
  {
    test: /\.(png|jpe?g|gif)(\?.*)?$/,
    loader: 'url-loader',
    query: {
      limit: 5120,
      name: '[name].[ext]'
    }
  },
  {
    test: /\.pug$/,
    loader: 'pug-loader'
  },
  {
    test: /\.js$/,
    use: {
      loader: 'babel-loader',
      options: babelConfig
    },
    include: srcFolders
  },
  {
    test: /\.tsx?$/,
    use: [
      {
        loader: 'babel-loader',
        options: babelConfig
      },
      {
        loader: 'ts-loader',
      }
    ],
    include: srcFolders
  }
]

const resolve = {
  extensions: ['.js', '.ts', '.json'],
  modules: [
    resolver('src'),
    resolver('node_modules')
  ]
}

module.exports = {
  rules,
  resolve
}
