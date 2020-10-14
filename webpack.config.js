const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  // Tells Webpack which built-in optimizations to use
  // In 'production' mode, Webpack will minify and uglify our JS code
  // If you leave this out, Webpack will default to 'production'
  mode: devMode ? 'development' : 'production',

  // Webpack needs to know where to start the bundling process,
  // so we define the main JS and Sass files, both under
  // the './src' directory
  entry: ['./src/scripts/main.js', './src/styles/main.scss'],

  // This is where we define the path where Webpack will place
  // the bundled JS file
  output: {
    path: path.resolve(__dirname, 'public'),

    // Specify the base path for all the assets within your
    // application. This is relative to the output path, so in
    // our case it will be ./public/assets
    publicPath: '/assets',

    // The name of the output bundle. Path is also relative
    // to the output path
    filename: 'assets/scripts/bundle.js',
  },
  module: {
    // Array of rules that tells Webpack how the modules (output)
    // will be created
    rules: [
      {
        // Look for JavaScript files and apply the babel-loader
        // excluding the './node_modules' directory. It uses the
        // configuration in `.babelrc`
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        // Look for Sass files and process them according to the
        // rules specified in the different loaders
        test: /\.(sa|sc)ss$/,

        // Use the following loaders from right-to-left, so it will
        // use sass-loader first and ending with MiniCssExtractPlugin
        use: [
          {
            // Extracts the CSS into a separate file and uses the
            // defined configurations in the 'plugins' section
            loader: MiniCssExtractPlugin.loader,
          },
          {
            // Interprets CSS
            loader: 'css-loader',
            options: {
              importLoaders: 2,
            },
          },
          {
            // Use PostCSS to minify and autoprefix with vendor rules
            // for older browser compatibility
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                // We instruct PostCSS to use postcss-preset-env
                // when in production mode, otherwise do nothing
                plugins: devMode
                  ? []
                  : [
                      [
                        'postcss-preset-env',
                        {
                          // Compile our CSS code to support browsers
                          // that are used in more than 1% of the
                          // global market browser share. You can modify
                          // the target browsers according to your needs
                          // by using supported queries.
                          // https://github.com/browserslist/browserslist#queries
                          browsers: ['>1%'],
                        },
                      ],
                    ],
              },
            },
          },
          {
            // Adds support for Sass files, if using Less, then
            // use the less-loader
            loader: 'sass-loader',
          },
        ],
      },
      {
        // Adds support to load images in your CSS rules. It looks for
        // .png, .jpg, .jpeg and .gif
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              // The image will be named with the original name and
              // extension
              name: '[name].[ext]',

              // Indicates where the images are stored and will use
              // this path when generating the CSS files.
              // Example, in main.scss I have
              // url('../../public/assets/images/venice-italy.jpg')
              // and when generating the CSS file, it will be outputted
              // as url(../images/venice-italy.jpg), which is relative
              // to /styles/main.css
              publicPath: '../images',

              // When this option is 'true', the loader will emit the
              // image to output.path
              emitFile: false,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    // Configuration options for MiniCssExtractPlugin. Here I'm only
    // indicating what the CSS outputted file name should be and
    // the location
    new MiniCssExtractPlugin({
      filename: 'assets/styles/main.css',
    }),
  ],
};
