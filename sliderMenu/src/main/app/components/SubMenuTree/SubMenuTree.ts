import "./index.less";
import remote from "./remote";
var count = 0;
export default class SubMenuTree  {
  hashName: any="SubMenuTree";
  count_level: number;
  hashIsDynamic: any;
  eventName: any;
  level: number;
  static properties = {
    name: "SubMenuTree",
    categoryCode: "common",
    nameDes: "菜单树",
    params: {
      basic: {
        label: "基础配置",
        type: "group",
        isGroup: true,
        params: {
          "layout": {
            "label": "布局",
            type: "dropdown",
            isDrop: true,
            options: [
              {
                name: "常规",
                value: ""
              },
              {
                name: "水平",
                value: "h-sidebar"
              }
            ]
          },
          "isOpen":{
            label: "是否展开",
            type: "checkbox",
            isCheck: true
          },
          "className":{
            label: "className",
            isText: true,
            type: "text"
          },
          "eventName": {
            "label": "事件",
            type: "dropdown",
            isDrop: true,
            options: [
              {
                name: "desktop",
                value: "desktop"
              },
              {
                name: "subDesktop",
                value: "subDesktop"
              }
            ]

          },
          "maxLevel": {
            label: "最大深度",
            isText: true,
            type: "text"
          },
          "hashName": {
            label: "hashName",
            isText: true,
            type: "text"
          }
        }
      },
      rootCodes: {
        label: "设置菜单根节点",
        isText: true,
        type: "text"
      },
      showRoot: {
        label: "是否显示根节点",
        type: "checkbox",
        isCheck: true,
        defaultValue: false
      },
      defaultIsNoActive: {
        label: "是否取消初始选中",
        type: "checkbox",
        isCheck: true,
        defaultValue: false
      },
      themes: {
        label: "主题设置",
        type: "group",
        isGroup: true,
        params: {
          color: {
            label: "文字颜色",
            type: "color",
            isColor: true
          },
          backgroundColor: {
            label: "背景颜色",
            type: "color",
            isColor: true
          }
        }
      },
      activeStyles: {
        label: "选中效果",
        type: "group",
        isGroup: true,
        params: {
          backgroundColor: {
            label: "背景色",
            type: "color",
            isColor: true
          },
          color: {
            label: "文字颜色",
            type: "color",
            isColor: true
          }
        }
      },
      targetBox: {
        label: "目标容器",
        isGroup: true,
        type: "group",
        params: {
          hasTargetBox: {
            label: "是否有目标容器",
            type: "checkbox",
            isCheck: true,
            defaultValue: false
          },
          selector: {
            label: "容器选择",
            isText: true,
            type: "text"
          }
        }
      }
    }
  };
  static generatedId() {
    let name = SubMenuTree.properties.name;
    count++;
    return name + "_" + count;
  }
  static getUserId() {
    return UserProfile.userId;
  }
  moduleId: string = SubMenuTree.generatedId();
  //用户id
  userId: string = SubMenuTree.getUserId();
  parentDiv: string | JQuery;
  params: any;
  _params: any;
  $dom: JQuery;
  $ul = $('<ul class="nav nav-list" role="root"></ul>');
  li_template = `<li data-id="{{operationId}}" {{#if hasChildren}}  role="tree-item" class="{{#if isOpen}}open{{/if}}" {{else}} role="tree-leaf" {{/if}}>
                  <a href="javascript:void(0)" class="dropdown-toggle">
                  {{#if isRoot}}
                   <i class="submentree-menu-icon {{icon}}"></i>&nbsp;
                  <span class="submentree-menu-text">{{name}}</span>
                  {{else}}
                     <span class="submentree-menu-text"><i class="{{icon}}"></i>&nbsp;{{name}}&nbsp;</span>
                  {{/if}}
                </a>
                  {{#if hasChildren}}
                     <b class="arrow"></b>
                     <ul class="submenu Common_scrollBar"></ul>
                  {{/if}}
               </li>`;
  idMap = "operationId";
  root: any = {};
  rootCodes: any = [];
  oRoot: any = {};
  iNow: number = 0;
  $wrap: JQuery;
  init() {
    this.wrapper();
    this.process();
    this.renderPNodes();
    this.getMenus();
    this.events();
    this.collapse();
  }
  collapse(){
    this.$dom.addClass('menu-min');
  }
  renderPNodes(){
    let $p = this.getParent();
    if($p){
       $('.nav-list',this.$dom).removeClass('Common_scrollBar');
       $p.parent('p-container');
       $p.addClass('p-sidebar');
       $p.next().addClass('p-content');
    }
  }
  getParent(){
    let $p;
    if (typeof this.parentDiv == "string") {
      $p = $('#' + this.parentDiv);
    } else if (this.parentDiv && !$.isPlainObject(this.parentDiv)) {
      $p = $(this.parentDiv);
    }
   return $p;
  }

  wrapper() {
    let $p= this.getParent();
    this.$dom = $('<div class="submenutree" role="navchange"></div>');
    let name = SubMenuTree.properties.name;
    this.$dom.attr("data-module", name).data(name, this);
    this.$wrap = $('<div class="wrap"></div>');
    this.$wrap.append(this.$ul);
    this.$dom.append(this.$wrap);
    // this.$dom.append(this.$ul);
    if($p){
      this.$dom.appendTo($p);
    }
  }
  process() {
    var dfs = {
      "basic": {
        "layout": "",
        "className":"",
        "eventName": "subDesktop",
        "minLevel": false,
        "maxLevel": false,
        "hashName": "SubMenuTree"
      }
    };
    this._params = $.extend({}, dfs || {}, this.params || {});
    let p = this._params || {};
    if ($.trim((this._params.rootCodes || "")) == "") {
      this.rootCodes = [];
    } else {
      this.rootCodes = (this._params.rootCodes || "").split(',') || [];
      //对codes 进行排序
      this.rootCodes = this.rootCodes.sort(function (a: string, b: string) {
        return a.length > b.length;
      });
    }
    this.$dom.addClass(p.basic.layout);
    this.$dom.addClass(p.basic.className);
    if (p.basic.layout != "h-sidebar") {
      this.$ul.addClass("Common_scrollBar");
    }
    this.eventName = p.basic.eventName;
    this.hashName = p.basic.hashName||this.hashName;

    this._params.showRoot = typeof this._params.showRoot == undefined ? false : this._params.showRoot;

    this.root[this.idMap] = null;
  }
  /**
   * 获取用户菜单数据
   * 
   * 
   * @memberof SubMenuTree
   */
  getMenus() {
    remote.getMenuView(this.userId).then((json)=>{
      this.processNodes(json);
      this.showSliderBtn();
    });
  }
  /**
   * 处理节点数据
   * 
   * @param {*} json 
   * 
   * @memberof SubMenuTree
   */
  processNodes(json: any) {  
    if ($.isArray(json)) {
      this.root.node = json;
    } else if ($.isPlainObject(json)) {
      this.root.node = [json];
    } else {
      this.root.node = [];
    }
    //用户菜单保存
    UserProfile.menuConfigTree=this.root.node;
    /*新的树结构*/
    if (this.rootCodes.length > 0) {
      this.oRoot = this.searchCodes(this.rootCodes);
    } else {
      this.oRoot.nodes = json;
    }
    /**
     * 生成 nodes
     */
    this.addRootNodes();
    /**
     * 默认选中第一个叶子节点
     */
    if (!this._params.defaultIsNoActive)
      this.triggerDefaultItem();

  }
  searchCodes(codes: string[]) {
    var self = this, nodes: any = [];
    codes = codes || [];
    this.level = 0;
    for (let i = 0, len = codes.length; i < len; i++) {
      let code = codes[i];
      //是否存在 现有数据里面
      var node = self.searchNode(code, null, self.root.node);
      if (node) {
        nodes.push(node);
      }
    }
    return this.splitExistNodes(nodes);
  }
  //合并树结构 作排序 新的树结构
  splitExistNodes(nodes: any) {
    var temp: any = {}, id = this.idMap, self = this;
    temp.nodes = [];
    nodes = nodes || [];
    for (let i = 0, len = nodes.length; i < len; i++) {
      let c = nodes[i];
      if (c.parentid == null) {
        temp.nodes.push(c);
      } else if (c.parentid != null) {
        var e_nodes = temp.nodes || [], flag = false;
        /**
         * 是否存在已知数组里
         */
        for (let j = 0, l = e_nodes.length; j < l; j++) {
          let root = e_nodes[j].node;
          //parentid 和当前节点 id 相同
          if (root[id] == c.parentid) {
            flag = true;
            break;
          }
          //查找是否存在 已存在数组里的 子节点
          let t = self.searchNode(c, c.parentid, root);
          if (t) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          var n = $.extend({}, c);
          temp.nodes.push(n);
        }
      }
    }
    if (!this._params.showRoot) {
      var newNodes: any = [], nodes = temp.nodes;
      for (let i = 0, len = nodes.length; i < len; i++) {
        var children = nodes[i].node;
        if ($.isPlainObject(children)) {
          newNodes.push(children)
        } else if ($.isArray(children)) {
          newNodes = newNodes.concat(children);
        }
      }
      console.log(newNodes);
      temp.nodes = newNodes;
    }
    return temp;
  }
  /**
   * 查询 节点
   */
  searchNode(code: string, parentid: string | null, nodes: Array<any>): any {
    nodes = nodes || [];
    let id = this.idMap,
      target = null,
      self = this;
    for (let i = 0, len = nodes.length; i < len; i++) {
      var node = nodes[i];
      if (code == node[id]) {
        self.level++;
        node.level = self.level;
        node.parentid = parentid;
        target = node;
        break;
      }
    }
    if (!target) {
      for (let i = 0, len = nodes.length; i < len; i++) {
        var node = nodes[i];
        if (node.node) {
          let tempNodes = node.node || [];
          if ($.isPlainObject(tempNodes)) {
            tempNodes = [tempNodes];
          }
          target = self.searchNode(code, node[id], tempNodes);
          if (target) {
            break;
          }
        }
      }
    }
    return target;
  }
  //添加根节点
  addRootNodes() {
    let nodes = (this.oRoot || {}).nodes || [], self = this;
    this.count_level = 0;
    self.createChildNodes(self.$ul, nodes, true);
    self.setThemes();
  }
  //创建子节点
  /**
   * TODO
   * 
   * @param {*} parent 
   * @param {*} node 
   * 
   * @memberof SubMenuTree
   */
  createChildNodes(parent: JQuery, nodes: any, isRoot: boolean) {
    var self = this;
    if (nodes && $.isPlainObject(nodes)) {
      nodes = [nodes];
    }
    this.count_level++;

    for (var i = 0, len = nodes.length; i < len; i++) {
      var node = nodes[i];
      node.isRoot = isRoot;
      var $dom = self.createNode(node);

      if (node.hasChildren) {
        var box = $('ul.submenu', $dom).eq(0);
        self.createChildNodes(box, node.node, false);
      }
      parent.append($dom);
    }
  }
  isLevelFilter(){
    var flag=false,p=this._params||{},maxLevel=p.basic.maxLevel;
    maxLevel=parseInt(maxLevel);
    if ($.isNumeric(maxLevel)&&this.count_level+1 > maxLevel) {
      flag=true;
    }
    return flag;

  }
  createNode(node: any) {   
    var data = node || {},p=this._params||{};
    if (data.node) {
      data.hasChildren = true;
    } else {
      data.hasChildren = false;
    }
    if(this.isLevelFilter()){
      data.hasChildren=false;
      data.isRoot=false;
    }
    data.isOpen=typeof (p.basic||{}).isOpen == 'undefined'?true:(p.basic||{}).isOpen;
    
    if (!data.icon && data.isRoot) {
      data.icon = "fa fa-desktop";
    }
    var $dom = $(Handlebars.compile(this.li_template)(data));
    $dom.data("config", data.config);
    return $dom;
  }
  //动态显示上下滚动的按钮
  showSliderBtn() {
    let winHeight = $(window).height(),
        $li = $('.nav-list>li', this.$dom),
        itemNum = $li.length,
        itemHeight = $li.eq(0).height(),
        allLiHeight = itemNum*itemHeight;
    let $sliderBtn = $(`<a class="previousBtn icon-iconfontarrowdownB-copy" href="javascript:void(0)"></a> 
    <a class="nextBtn icon-iconfontarrowleft-copy" href="javascript:void(0)"></a>`);
    // 上下滚动按钮显示的条件：菜单所有项高度之和大于当前窗口高度减去按钮高度
    if(allLiHeight > winHeight - 40) {  //40为上下滚动按钮高度之和
      $sliderBtn.insertBefore(this.$wrap);
      //向上滚动按钮默认置灰
      $('.previousBtn', this.$dom).eq(0).css({'opacity': 0.2, 'cursor':'default'});
      $('ul.nav-list', this.$dom).height('800%');  
      this.$wrap.height(winHeight - 40);
      this.$wrap.css({'overflow': 'hidden', 'margin': '20px 0'});
      this.$dom.height(winHeight); 
    }
    // if(allLiHeight > 800) {  //40为上下滚动按钮高度之和
    //   $sliderBtn.insertBefore(this.$wrap);
    //   //向上滚动按钮默认置灰
    //   $('.previousBtn', this.$dom).eq(0).css('opacity', 0.2);
    //   $('ul.nav-list', this.$dom).height('800%');  
    //   this.$wrap.height(800);
    //   this.$wrap.css({'overflow': 'hidden', 'margin': '20px 0'});
    //   this.$dom.height(840); 
    // }
  }
  // 菜单项对应的子菜单下对齐显示，默认是上对齐显示
  subMenuBottomAlign(item:any) {
    let submenuTitle = $('.submentree-menu-text', item).eq(0),
        submenu = $('ul.submenu', item).eq(0);
    let offset = item.offset(), top:any,
        marginTop:any = this.$wrap.css('marginTop'); 
    if(offset) {
      top = offset.top - parseInt(marginTop);  //当前li距父级高
    }
    let submenuHeight = submenuTitle.outerHeight() + submenu.outerHeight(); //子菜单整体高度
    let bottom = this.$wrap.height() - top;  //单页，当前li距底部的距离
    if(submenuHeight > bottom) {  //单页中当前li对应子菜单整体高度大于li到底部的距离，设置为子菜单与li下对齐
      submenuTitle.css({'bottom': 0, 'top': 'auto'});
      submenu.css({'bottom': submenuTitle.height(), 'top': 'auto'}); 
      // 设置子菜单最大高度与当前li距父级的高度相等
      submenu.css('max-height', top);
    }
  }
  // 向上/下滚动显示
  slider(num: number) {
    this.iNow += num;
    let $li = $('.nav-list>li', this.$dom);
    let itemNum = $li.length,
        itemHeight = $li.eq(0).height(),
        perPageNum = this.$wrap.height()/itemHeight,  //单页展示的li数量
        isInt = Math.floor(perPageNum) === perPageNum; //单页展示的li数量是否为整数
    // 向下滚动到最后一项需要滚动的li数量(由于this.$wrap.height()的高度不固定，单页可能存在某个li显示不完整（即单页展示li数量不为整数）的情况)
    let endSliderNum = itemNum - Math.round(perPageNum);
    // 不是第一项，向上滚动按钮取消置灰
    if(this.iNow > 0) {
      $('.previousBtn', this.$dom).eq(0).css({'opacity': 1, 'cursor': 'pointer'});
    }
    // 不是最后一项，向下滚动按钮取消置灰
    if(isInt) {
      if(this.iNow < endSliderNum) {
        $('.nextBtn', this.$dom).eq(0).css({'opacity': 1, 'cursor': 'pointer'});
      }
    }else{
      if(this.iNow < endSliderNum + 1){
        $('.nextBtn', this.$dom).eq(0).css({'opacity': 1, 'cursor': 'pointer'});
      }
    }
    
    if(this.iNow < 0) {
      this.iNow = 0;
      return;
    }
    // 为了避免显示不全的li对应的子菜单内容显示不完整，单页li数量不为整数时允许多点击一次以保证最后一项的子菜单显示完整
    if(isInt) {  //单页展示li数量为整数
      if(this.iNow > endSliderNum) {
        this.iNow = endSliderNum;
        return;
      }
    }else{
      if(this.iNow > endSliderNum + 1) {
        this.iNow = endSliderNum + 1;
        return;
      }
    }
    $('.nav-list', this.$dom).stop().animate({'top': -this.iNow*itemHeight}, 1000);
    // 向上滚动到第一项时，向上按钮置灰
    if(this.iNow == 0) {
      $('.previousBtn', this.$dom).eq(0).css({'opacity': 0.2, 'cursor':'default'});
    }
    // 向下滚动到最后一项时，向下按钮置灰
    if(isInt) {
      if(this.iNow == endSliderNum) {
        $('.nextBtn', this.$dom).eq(0).css({'opacity': 0.2, 'cursor':'default'});
      }
    }else{
      if(this.iNow == endSliderNum + 1){
        $('.nextBtn', this.$dom).eq(0).css({'opacity': 0.2, 'cursor':'default'});
      }
    }
  }
  events() {
    var self = this, p = this._params || {}, activeStyles = p.activeStyles || {};
    //显示 隐藏 子菜单
    this.$dom.on("click", "li[role=tree-item] > a.dropdown-toggle", (e) => {
      let item = $(e.target).closest('li').eq(0), submenu = $('ul.submenu', item).eq(0);
      if(this.$dom.hasClass('menu-min')) {
        this.subMenuBottomAlign(item);
      }
      submenu.slideToggle(); 
    });
    // 鼠标移入显示子菜单
    this.$dom.on("mouseover", "li[role=tree-item] > a.dropdown-toggle", (e) => { 
      let item = $(e.target).closest('li').eq(0);
      if(this.$dom.hasClass('menu-min')) {
        this.subMenuBottomAlign(item);
      }
    })
    // 窗口缩放事件
    $(window).resize(() => {
      if(this.$dom.hasClass('menu-min')) {
        this.showSliderBtn();
      }
    })
    //subdesktop  
    this.$dom.on("click", "li[role=tree-leaf] > a", (e) => {
      let desktop=window.m;
      desktop.changedModuleInfo=null;
      let item = $(e.target).closest('li').eq(0);
      let id = item.attr("data-id");
      this.updateHash(id);
    });
    //desktop 权限id 修改 事件监听
    let desktop=window.m;
    let eventName=this.eventName;
    if(eventName&&desktop&&desktop instanceof window.TDesktop){
      let temp;
      if("desktop"== eventName){
        temp='desktop.changeDesktopNew';
        desktop.$dom.on("desktop.setDesktopOperationId",(e:any,operationid:string)=>{
          this.updateHash(operationid);
        });

      }else if('subDesktop'== eventName){
        temp='desktop.changeSubDesktop';
        desktop.$dom.on("desktop.setSubDesktopOperationId",(e:any,operationid:string)=>{
          this.updateHash(operationid);
        });
      }
      if(temp){
        desktop.$dom.on(temp,(e:any,operationid:string)=>{
          this.updateHash(operationid);
        });
      }
      
    }
    // 菜单上下滚动按钮点击事件
    this.$dom.on('click', '.previousBtn', e => {
      this.slider(-1);
    })
    this.$dom.on('click', '.nextBtn', e => {
      this.slider(1);
    })
  }
  setActiveItem(item: JQuery) {
    $('[role=tree-item],[role=tree-leaf]', this.$dom).removeClass("active");
    $('[role=tree-item] > a,[role=tree-leaf] > a', this.$dom).removeAttr('style');
    this.setThemes();
    if(item instanceof $){
      item.addClass("active");
      item.parents('li[role=tree-item]').addClass("active");
    }else if(typeof item == 'string'){
      $('[role=tree-leaf][data-id='+item+']',this.$dom).addClass("active").parents('li[role=tree-item]').addClass("active");
    }
    this.setActiveStyles();
    let _e=$.Event('SubMenuTree.menu.change');
    this.$dom.trigger(_e);
  }

  setActiveStyles() {
    let box = this.$dom, p = this._params || {}, styles = p.activeStyles || {};
    $('li[role=tree-leaf].active > a', box).css(styles);
    $('li[role=tree-item].active > a', box).css({ 'color': styles.color });
    if ((p.themes || {}).backgroundColor == '#FFFFFF') {
      $('li[role=tree-item].active > a', box).css({ 'color': styles.backgroundColor });
    }
  }
  getActiveItems(){
    var paths:string[]=[];
    $('li.active > a > span', this.$dom).each((idx:number,node:any)=>{
      paths.push($.trim($(node).text()));
    });
    return paths;
  }
  setThemes() {
    let p = this._params || {}, themes = p.themes || {};
    $('[role=tree-item] > a,[role=tree-leaf] > a', this.$dom).css(themes);
  }
  triggerDefaultItem() {
    let _hash:any = window.location.hash;
    let map = _hash.parseHash(), name = "SubMenuTree", flag = true;
    if (map[name] && map[name].id) {
      let id = map[name].id;

      let t = $('li[role=tree-leaf][data-id=' + id + '] > a', this.$dom);
      if (t.length > 0) {
        this.updateHash(id);
        flag = false;
      }
    }
    if (flag) {
      let id = $('li[role=tree-leaf]', this.$dom).eq(0).data("id");
      this.updateHash(id);
    }
    this.changeDesktop();

  }
  changeDesktop() {
    let _hash:any = window.location.hash;
    let map = _hash.parseHash(), name = this.hashName;
   
    if ($.trim(name)!=""&&map[name] && map[name].id) {
      let id = map[name].id;
      let item = $('[data-id=' + id + ']', this.$dom).eq(0), config: string = item.data("config");
        if(item.length>0&&!item.hasClass('active')){
          this.setActiveItem(item);
          this.renderMenuXml(config);
      }
    }
  }
  renderMenuXml(xml: any) {
    let p = this.params || {}, target = p.targetBox || {};
    let desktop = window.m;
    if (target.hasTargetBox && $.trim(target.selector) != "") {
      let parentDiv = $(target.selector).get(0);
      if (desktop && $.isFunction(desktop.renderXmlToTarget))
        desktop.renderXmlToTarget(parentDiv, xml, this.moduleId);
    } else {
      let eventName = this.eventName;
      if (eventName == "subDesktop") {
        // $.publish("desktop.changeSubDesktop", xml);
        if(desktop)
        desktop.changeSubDesktop(null,xml);
        

      } else if (eventName == "desktop") {
        // $.publish("desktop.changeDesktopNew", xml);
        if(desktop)
        desktop.changeDesktopNew(null,xml);
      }

    }
  }


  updateHash(newid: string) {
    let hash:any = window.location.hash;
    let map = hash.parseHash(),
      name = this.hashName||"SubMenuTree";
    if ($.trim(name)!=""&&map[name] && map[name].id) {
      let id = map[name].id;
      hash = hash.replace('#' + name + "?id=" + id, '#' + name + '?id=' + newid);

    } else if (map[name]) {
      //   hash.replace('#' + name + "?id=" + id, '#' + name + '?id=' + newid);
    } else {
      hash = hash + '#' + name + '?id=' + newid;
    }
    window.location.hash = hash;

    if (!$.isFunction((<any>(document.body)).onhashchange)) {
      this.changeDesktop();
    }

  }
  didRemove() {

  }

}
