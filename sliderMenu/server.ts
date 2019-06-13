var path = require("path");
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var config = require("./webpack.dev.config");
var opn = require("opn");
var ip = "0.0.0.0";
var port = 8082;
const projectname = "com.tongtu.tocc.syh.dp.web";
var ngixdir = "/syh/";
// var webpackDevServerEntries = ["webpack-dev-server/client?http://" + ip + ":" + port, "webpack/hot/only-dev-server"]
// if (typeof config.entry === 'string') {
//     config.entry = webpackDevServerEntries.concat([config.entry])
// } else if (typeof config.entry === 'object') {
//     for (var k in config.entry) {
//         var main = config.entry[k]
//         config.entry[k] = webpackDevServerEntries.concat(main)
//     }
// }
var base_proxy = "http://192.168.100.204:9876";
var proxys: any = {
  // '/desktop2/**/*.(png|jpg|json|js|js.map|css|css.map|ts|ts.map)':{
  //   target:"http://localhost:9000",
  //   pathRewrite:{
  //     '/desktop2/':'/'
  //   }
  // }
  // ,
  //西安
  // '/security/**/*':{
  //    target:'http://192.168.100.204:9876'
  // },
  // ,
  // '/geoserver/(syh|tongtu)/**/*':{
  //    target:'http://192.168.100.206:8080'
  // },
  "/trafficengine/": {
    target: "http://113.140.71.252:8889"
  },
  "/indicator/service/*": {
    target: "http://syh.bjjtw.gov.cn:8082"
    // ,
    // secure: false
  },
  "/indicator/**/*.(css|css.map|js|js.map)": {
    target: "http://192.168.100.204:9876"
  }
};
if(process.env.MOCK){
  config.entry[projectname]=[path.resolve(__dirname,'./mock/index.ts')].concat( config.entry[projectname]);
  console.log('--启动 MOCK --');
}else{
  console.log('--连接生产环境 --');
  proxys["/syh/services/**/*"]={
    target:  "http://syh.bjjtw.gov.cn:8082"
    // ,
    // secure: false
  }
}
var tempPathRewrite: any = {
  target: "http://localhost:" + port,
  pathRewrite: {}
};
tempPathRewrite.pathRewrite[ngixdir] = "/";
proxys[
  ngixdir + "**/*.(js|css|js.map|css.map|png|jpg|json|geojson|txt)"
] = tempPathRewrite;

var proxy_names = [
  "trafficengine",
  "whgadsjzs",
  "dsjzspt",
  "desktop2",
  "order",
  "security",
  "indexer",
  // "indicator",
  "core",
  "info",
  "report",
  "MapService",
  "taxi",
  "bus",
  "park",
  "gismt",
  "geoserver",
  "xntocc",
  "whindex",
  "caltraindex",
  "check",
  "extract",
  "taxibd",
  "analysis",
  "whbuscity",
  "whtocc",
  "datamonitor",
  "alarm"
];
// proxy_names.push('syh');

for (var i = 0, l = proxy_names.length; i < l; i++) {
  var key = proxy_names[i];
  if (!proxys["/" + key + "/*"])
    proxys["/" + key + "/*"] = {
      target: base_proxy,
      secure: false
    };
}

new WebpackDevServer(webpack(config), {
  contentBase: path.resolve(__dirname, "./"),
  hot: true,

  public: "ttyjbj.ticp.net:18080",
  // watch: true,
  //设置webpack-dev-server启动的时候，bundles的输出的路径，打包的时候这个publicPath没有作用
  publicPath: config.output.publicPath,
  // inline: true,
  // noInfo: true,
  historyApiFallback: false,
  // /api/* 会指向  http://127.0.0.1:3000/api/*  如  /api/users 就会指向  http://127.0.0.1:3000/api/users
  proxy: proxys
}).listen(port, function(err: any) {
  if (err) {
    console.log(err); //eslint-disable-line no-console
  } else {
    opn("http://127.0.0.1:" + port);
    console.log("Listening at http://127.0.0.1:" + port); //eslint-disable-line no-console
  }
});
