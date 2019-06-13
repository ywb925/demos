declare var __webpack_public_path__: string;
declare module "*.template";
declare module "*.js";
// declare var require: {
//     (path: string): any;
//     (paths: string[], callback: (...modules: any[]) => void): void;
//     ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
// };
declare interface Symbol {}
declare interface Validator { }
declare interface JQuery {
    serializeJSON(): any;
    validate(settings?: { ignore?:string,nsubmit?:boolean, submitHandler: (form: HTMLFormElement) => void }): Validator;
    zoom(key?:string):any;
    resizePanelHeight():any;
    jstree(opts:any):any;
    loading(type:'show'|'hide'):any;
    zTree:{
        init:(dom:JQuery,settings:any,data?:any[])=>any
    }
}
declare interface Window {
    [name: string]: any
}
declare interface gritterSettings {
    class_name?: string;
    fade_in_speed?: string;
    fade_out_speed?: number;
    position?: string;
    time?: number;
    title?: string;
    text?: string;
    sticky?: string;
    image?: string;
}
declare interface Gritter {
    add(params?: gritterSettings): any;
    options: gritterSettings;
    remove(id: string, params?: gritterSettings): any;
    removeAll(params?: gritterSettings): any;

}
declare interface JQueryStatic {
    gritter: Gritter;
    jstree: any;
}
/**
 * url-parse destination
 */
declare module 'url-parse' {
    interface urlProps {
        protocol?: string;
        slashes?: boolean;
        auth?: any;
        username?: string;
        password?: string;
        host?: string | number;
        hostname?: string;
        port?: string | number;
        pathname?: string;
        query?: any;
        origin?: string;
        hash?: string;
        href?: string;
    }
    interface URL extends urlProps {
        (url: string, baseURL?: string | urlProps, parser?: boolean | Function): void;
        set(key: string, value: string | number): void;
        toString(): string;
    }
    export default URL;
}
/**
 * @namespace 'basic-components'
 */
declare module 'basic-components' {
    export interface IParamsValue {
        label: string;
        type?: 'text' | 'checkbox' | 'dropdown' | 'group' | 'color' | 'tabArray';
        defaultValue?: string;
        options?: Array<{
            name: string;
            value: string;
            selected?: boolean;
        }>;
        isText?: boolean;
        isDrop?: boolean;
        isCheck?: boolean;
        isGroup?: boolean;
        isColor?: boolean;
        isTabArray?: boolean;
    }
    export interface IParams {
        [name: string]: IParamsValue;
    }
    /**
     * @interface 'basic-components'.IProperties 编辑器参数配置
     */
    export interface IProperties {
        /**
         * @member {string} 'basic-components'.IProperties#categoryCode 组件分类code
         */
        categoryCode: string;
         /**
         * @member {string} 'basic-components'.IProperties#name 组件名
         */
        name: string;
        nameDes: string;
        thumbnailUrl?: string;
        template?: string;
        /**
         * @member {T}  'basic-components'.IProperties#params 组件分类code
         */
        params?: IParams | any;
    }
    /**
     * @class 'basic-components'.IPuginsBase 常规组件 需要的配置
     */
    export interface IPuginsBase {
        /**
         * @member {string} 'basic-components'.IPuginsBase#moduleId 组件独立id
         */
        moduleId: string;
         /**
         * @member {string|JQuery} 'basic-components'.IPuginsBase#parentDiv 父容器参数
         */
        parentDiv: string|JQuery| undefined;
        /**
         * @member {T} 'basic-components'.IPuginsBase#params 组件参数
         */
        params: any;
         /**
         * @member {T} 'basic-components'.IPuginsBase#_params 组件内置参数
         */
        _params:any;
         /**
         * @member {JQuery} 'basic-components'.IPuginsBase#$dom 组件容器
         */
        $dom:JQuery;
         /**
         * @method {void} 'basic-components'.IPuginsBase#init 组件入口函数
         */
        init(): any;
           /**
         * @method {void} 'basic-components'.IPuginsBase#didRemove 组件销毁函数
         */
        didRemove(): any;
    }
    export interface IremotePluginBase{
        params: any;
        _params:any;
        init(): any;

    }
}
declare var ol:any;
declare var goog: any;
declare var gist:any;
declare var npm: string;
interface JQueryStatic{
    datetimepicker:any;
    keyframe:any;
}
declare var echarts3:any;
declare var moment:any;
/**
 * 业务
 */
declare var BusSvc:any;
declare var DesktopSvc:any;
declare var UserProfile:any;

interface IHandlebars{
    compile(str:string):any;
}


interface JQueryStatic{
  subscribe(eventName:string,args?:any):any;
  unsubscribe(eventName:string):any;
  publish(eventName:string,args?:any):any;
}
interface JQuery{
  chosen(opts?:any):any;
  slide(opts?:any):any;
  datetimepicker(opts?:any,opts2?:any):any;
  onresize():JQuery;
  colorpicker():any;
}
interface ArrayConstructor{
  from(o?:any):any;
}


/**
 * 视频监控
 */
interface IKurentoClient{
 
  (url:string,options?:any,callback?:any):any;
   register:any;
  create(type:string,callback?:any):any

}
interface IKurentoUtils{
  WebRtcPeer:any;

}
declare var kurentoClient:IKurentoClient;
declare var kurentoUtils:IKurentoUtils;

declare namespace DataTables{
    interface IFixedColumns extends Api{
        update():void;
    }
    export interface Api{
        // buttons():{container():JQuery};
        fixedColumns():IFixedColumns;
        table():{header():any};
    }
}
declare var CodeMirror:{
    fromTextArea(textarea:Element,opts?:any):any
};

interface IMsg{
    alert(text:string,isFail?:boolean):void;
}
declare var vkbeautify:{
    xml(output:string):string;
}
declare var echarts:any;
declare var msg:IMsg;
declare var BMap:any;
declare var mapv:any;
declare var OlMap:any;
declare var TDataTable:any;
declare var SearchFieldsForm:any;
declare var _saveAs:(blob:any,title:string)=>void;