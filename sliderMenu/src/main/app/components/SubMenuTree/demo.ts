import SubMenuTree from "./SubMenuTree";
var layout = require('./page.hbs');
$(layout()).appendTo('#root');
UserProfile.userId = 'admin1';
var _x=new SubMenuTree();
_x.parentDiv=$('.p-sidebar','#root');
_x.params={
  // "rootCodes": "512",
  "showRoot": true,
  "defaultIsNoActive": false,
  "themes": {},
  "activeStyles": {},
  "targetBox": {
    "hasTargetBox": false
  },
  "name": "SubMenuTree",
  "key": "SubMenuTree"
};
_x.init();