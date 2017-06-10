// 文件名称: dms
//
// 创 建 人: chenshy
// 创建日期: 2015/5/20 15:35
// 描    述: dms
var dms = window.dms || {};
/**
 * 图片加载异常事件
 */
dms.IMAGE_LOAD_ERROR = 'imageLoadError';
/**
 * 图片加载完成事件
 */
dms.IMAGE_LOADED = 'image_loaded';

dms.VERSION = 3.0;

dms.animationMouseLock = {};

dms.triggerEvent = $({});
dms.PAUSE_OTHER_AUDIOS = "pauseOtherAudios";    //关闭所有其他音频的事件
dms.PAUSE_MAIN_AUDIO = "pauseMainAudio";        //关闭主音频事件
dms.REPLAY_MAIN_AUDIO = "replayMainAudio";      //重新播放主音频

dms.dispatcher = new dms.EventDispatcher();         //事件派发者
dms.MANI_AUDIO_PLAY = "mainAudioPlay";          //主音乐打开
dms.OTHER_AUDIO_PLAY = "otherAudiosPlay";    //关闭非主页的当前播放其他音频的事件
dms.OTHER_AUDIO_END = "otherAudioEnd";    //关闭非主页的当前播放其他音频的事件
dms.SWIPE_TOUCH_END = "swipeTouchEnd";      //滑动关闭页
dms.VIDEO_PLAY = "videoPlay";      //视频播放
dms.VIDEO_END = "videoEnd";      //视频结束或者暂停
dms.notHScroll = false;
dms.notVScroll = false;
dms.NO_BOTTOM_LOGO = false;       //是否有底标
dms.IS_LOOP_PLAY = false;       //是否循环播放

dms.pageAnimation = {

};

//(function(){
//    var dmsCssText = "";
//    var dmsCssStyle = document.createElement("style");
//    dmsCssStyle.type = "text/css";
//
//    dmsCssStyle.innerHTML = dmsCssText;
//    document.head.appendChild(dmsCssStyle);
//})();

dms.inherits = function(childClass,parentClass){
    Agile.Utils.inherits(childClass, parentClass);
};


dms.inherit = function(childClass,parentClass){
    childClass.prototype = Object.create(parentClass.prototype);
    childClass.prototype.constructor = childClass;
};

dms.isString = function(obj) {
    return typeof obj == 'string' || Object.prototype.toString.call(obj) == '[object String]';
};

dms.isObject = function(obj) {
    return typeof obj == 'object' || Object.prototype.toString.call(obj) == '[object Object]';
};

dms.id = (0|(Math.random()*998));

/**
 * 显示对象默认深度
 * @type {number}
 */
dms.defaultDepth = 100;

/**
 * 获取一个全局唯一id
 */
dms.getNewID = function(){
    this.id++;
    return this.id;
};

/**
 * 判断字符串是否为json
 * @param str
 * @returns {boolean}
 */
dms.isJsonObject = function(str){
    if(!str){
        return false;
    }else if(str.indexOf("{") == 0 && str.lastIndexOf("}") == str.length - 1){
        return true;
    }
    return false;
};

dms.toJSON = function(jsonStr){
    return (new Function("", "return " + jsonStr))();
};
dms.isPC = function(){
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
    var flag = true;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
    }
    return flag;
};

dms.isIOS = function(){
    var userAgentInfo = navigator.userAgent;
    var Agents = new Array("iPhone","iPad", "iPod");
    var flag = false;
    for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = true; break; }
    }
    return flag;
};

/**
* 判断是否在微信内部
* @returns {boolean}
*/
dms.isWeiXinPlatform = function () {
    var userAgent = navigator.userAgent.toLowerCase();
    var res = false;
    //来源判断
    if (userAgent.indexOf("micromessenger") > -1) {
        res = true;
    }
    return res;
};

dms.changeQiNiuUrl = function(url){
    var newUrl = "";
    if(url.indexOf("imageView2") > -1){
        newUrl = url + "/interlace/1"
    }else{
        newUrl = url + "?imageView2/2/interlace/1"
    }
    return newUrl;
};

/**
 * 创建事件
 * @param type 事件类型
 * @param target 事件作用的对象
 * @returns {*|Event} 返回的事件可以由cm.EventDispatcher派发
 */
dms.createEvent = function(type,target){
    var event = new dms.Event(type);
    event.target = target;
    return event;
};

dms.isArray = function(obj) {
    return Object.prototype.toString.call(obj) == '[object Array]';
};

dms.cloneJSONObject = function(b) {
    var a, s;
    //console.log(b);
    if (dms.isArray(b)) {
        a = [];
        var d, g = b.length;
        for (d = 0; d < g; d++) s = b[d],
            a[d] = "object" === typeof s ? dms.cloneJSONObject(s) : s
    } else for (d in a = {},
        b)"prototype" != d && (s = b[d], a[d] = "object" === typeof s ? dms.cloneJSONObject(s) : s);
    return a
};

/**
 * 根据pc还是手机返回不同的点击事件名称
 * @returns {string}
 */
dms.getEventName = function(){
    return dms.isPC() ? "click" : "tap";
};