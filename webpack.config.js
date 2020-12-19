const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const MODE_DEVELOPMENT = 'development'
const MODE_PRODUCTION = 'production'

const REG_EXP = {
  twig: /\.twig$/,
  js: /\.js/,
  css: /\.(p?css)$/,
  files: /\.(png|jpe?g|gif|svg|woff(2)?|ttf|eot)$/,
  modules: /node_modules/,
}

const BASE_FOLDER = 'src'

const HTML_FOLDER = `${BASE_FOLDER}/html`
const COMPONENTS_FOLDER = `${HTML_FOLDER}/components`
const LAYOUT_FOLDER = `${HTML_FOLDER}/layout`
const PAGES_FOLDER = `${HTML_FOLDER}/pages`

const JS_FOLDER = `${BASE_FOLDER}/js`

const IMAGES_FOLDER = '/images'

// const FONTS_FOLDER = '/fonts';

const BUILD_FOLDER = 'build'

const NAME_MAIN_JS_FILE = 'app.js'
const BUNDLE_NAME = 'bundle.js'

const isDevelopment = process.env.NODE_ENV !== MODE_PRODUCTION
const port = process.env.PORT || 3000

function generateHtmlPlugins({ templateDir, isDev }) {
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map((item) => {
    const [name, extension] = item.split('.')
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      minify: !isDev && {
        html5: true,
        collapseWhitespace: true,
        caseSensitive: true,
        removeComments: true,
      },
    })
  })
}

const htmlTemplates = generateHtmlPlugins({
  templateDir: PAGES_FOLDER,
  isDevelopment,
})

const getPlugins = (isDev) =>
  [
    new MiniCssExtractPlugin({
      filename: isDev ? '[name].css' : '[name].[fullhash].css',
      chunkFilename: isDev ? '[id].css' : '[id].[fullhash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, `${BASE_FOLDER}${IMAGES_FOLDER}`),
          to: `.${IMAGES_FOLDER}`,
        },
        // if you need fonts add them in src/fonts
        // {
        //   from: path.resolve(__dirname, `${BASE_FOLDER}${FONTS_FOLDER}`),
        //   to: `.${FONTS_FOLDER}`,
        // },
      ],
    }),
    isDev && new webpack.HotModuleReplacementPlugin(),
    !isDev &&
      new CleanWebpackPlugin({
        cleanAfterEveryBuildPatterns: ['build'],
      }),
  ]
    .concat(htmlTemplates)
    .filter((plugin) => plugin)

const getRules = (isDev) => [
  {
    test: REG_EXP.twig,
    use: [
      'raw-loader',
      {
        loader: 'twig-html-loader',
        options: {
          namespaces: {
            layout: path.resolve(__dirname, LAYOUT_FOLDER),
            components: path.resolve(__dirname, COMPONENTS_FOLDER),
            pages: path.resolve(__dirname, PAGES_FOLDER),
          },
        },
      },
    ],
  },
  {
    test: REG_EXP.js,
    exclude: REG_EXP.modules,
    use: ['cache-loader', 'babel-loader?cacheDirectory', 'thread-loader'],
  },
  {
    test: REG_EXP.css,
    use: [
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          url: false,
          sourceMap: isDev,
          importLoaders: 1,
        },
      },
      {
        loader: 'postcss-loader',
        options: {
          postcssOptions: {
            config: path.resolve(__dirname, 'postcss.config.js'),
            sourceMap: isDev,
          },
          sourceMap: isDev,
        },
      },
    ],
  },
  {
    test: REG_EXP.files,
    use: [
      {
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'static',
          publicPath: 'static',
        },
      },
      {
        loader: 'image-webpack-loader',
        options: {
          mozjpeg: {
            progressive: true,
            quality: 65,
          },
          optipng: {
            enabled: true,
          },
          pngquant: {
            quality: [0.6, 0.9],
            speed: 4,
          },
          gifsicle: {
            interlaced: false,
          },
          webp: {
            quality: 75,
          },
        },
      },
    ],
  },
]

const getOptimization = (isDev) => ({
  minimize: !isDev,
  minimizer: isDev
    ? []
    : [
        new CssMinimizerPlugin({
          test: REG_EXP.css,
        }),
        new TerserPlugin({}),
      ],
})

module.exports = {
  entry: {
    bundle: path.resolve(__dirname, `${JS_FOLDER}/${NAME_MAIN_JS_FILE}`),
  },
  output: {
    path: path.resolve(__dirname, BUILD_FOLDER),
    filename: isDevelopment ? '[name].js' : `[fullhash].${BUNDLE_NAME}`,
  },
  mode: isDevelopment ? MODE_DEVELOPMENT : MODE_PRODUCTION,
  devtool: isDevelopment && 'source-map',
  devServer: {
    port,
    historyApiFallback: true,
    static: {
      directory: path.resolve(__dirname, BASE_FOLDER),
    },
  },
  module: {
    rules: getRules(isDevelopment),
  },
  plugins: getPlugins(isDevelopment),
  optimization: getOptimization(isDevelopment),
}
