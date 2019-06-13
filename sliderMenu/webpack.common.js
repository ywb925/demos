var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const projectname = "component";
const extractLESS = new ExtractTextPlugin({
  filename: "css/" + projectname + ".css",
  allChunks: true
});
var config = {
  context: path.join(__dirname, "./src/main/app"),
  output: {
    filename: "js/[name].js"
  },
  entry: {
    main: []
  },
  resolve: {
    extensions: [".webpack.js", ".web.js", ".js", ".ts", ".jsx", ".tsx"]
  },
  node: {
    fs: "empty"
  },
  externals: {
    jquery: "jQuery",
    jquery: "$",
    echarts: "echarts"
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: extractLESS.extract(["css-loader", "postcss-loader"])
      },
      {
        test: /\.less$/i,
        use: extractLESS.extract(["css-loader", "less-loader"])
      },
      {
        test: /\.tsx?$/,
        loaders: ["ts-loader"],
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.json$/,
        loaders: ["json"],
        exclude: /(node_modules|bower_components)/
      },
      //如果不超过30000/1024kb,那么就直接采用dataUrl的形式,超过则返回链接,图片会复制到dist目录下
      {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader:
          "url-loader?limit=30000&useRelativePath=true&publicPath=../&name=images/[name].[ext]"
      },
      {
        test: /\.(svg|ttf|eot|svg|woff(\(?2\)?)?)(\?[a-zA-Z_0-9.=&]*)?(#[a-zA-Z_0-9.=&]*)?$/,
        loader: "file-loader"
      },
      {
        test: /\.(template|hbs)$/,
        loader:
          "handlebars-loader?helperDirs[]=" +
          path.join(__dirname, "src/main/app/helpers")
      }
    ]
  },
  resolveLoader: {
    // root: path.join(__dirname, 'node_modules')
    moduleExtensions: ["-loader"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src/main/app/index.hbs"),
      filename: "index.html",
      chunks: [projectname, "main"],
      chunksSortMode: "manual"
    }),
    new CopyWebpackPlugin(
      [
        {
          from: path.join(__dirname, "src/main/app/json"),
          to: "json"
        },
        {
          from: path.join(__dirname, "src/main/app/images"),
          to: "images"
        }
      ],
      { debug: true }
    ),
    extractLESS
  ]
};
if (process.env.NODE_ENV === "production") {
  config.entry.main = ["./main.pro.ts"];
}
config.entry[projectname] = ["./components/index.ts"];
module.exports = function(type) {
  switch (type) {
    case "dev":
      config.entry[projectname] = ["./components/index.ts"];
      config.entry.main = ["./main.ts"];
      config.output.path = path.join(__dirname, "hot");
      config.output.chunkFilename = "[id].chunk.js";
      config.plugins = [
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify("development")
          }
        }),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery"
        }),
        new webpack.HotModuleReplacementPlugin()
      ].concat(config.plugins);
      config.devtool = "source-map";
      break;
    case "pro":
      config.entry.main = ["./main.pro.ts"];
      config.output.path = path.join(__dirname, "webapp");
      config.output.chunkFilename = "[id].js";
      config.plugins = [
        new webpack.DefinePlugin({
          "process.env": {
            NODE_ENV: JSON.stringify("production")
          }
        }),
        new webpack.ProvidePlugin({
          $: "jquery",
          jQuery: "jquery",
          echarts: "echarts"
        })
      ].concat(config.plugins);
      break;
  }
  return config;
};
