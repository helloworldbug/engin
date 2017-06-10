// 文件名称: dms.LongPress
//
// 创 建 人: fishYu
// 创建日期: 2015/10/28 19:05
// 描    述: 长按

dms.LongPress = function(){
    dms.RenderObject.call(this);
};

dms.inherit(dms.LongPress,dms.RenderObject);
/**
 * 长按处理事件
 * @param itemHref
 * @param openLinkWay
 * @returns {boolean}
 */
dms.LongPress.prototype.goTouchStart = function(o){
    var self = this;
    //这里设置定时器，定义长按500毫秒触发长按事件，时间可以自己改，个人感觉500毫秒非常合适
    this.timeOutEvent = setTimeout(function(){
        self.longPress(o);
    },500);
    return false;
};

dms.LongPress.prototype.goTouchEnd = function(){
    clearTimeout(this.timeOutEvent);//清除定时器
    if(this.timeOutEvent!=0){
//        alert("你这是点击，不是长按");
    }
    return false;
};

dms.LongPress.prototype.goTouchMove = function(){
    clearTimeout(this.timeOutEvent);//清除定时器
    this.timeOutEvent = 0;
    return false;
};

dms.LongPress.prototype.longPress = function(o){
    this.timeOutEvent = 0;
    //派发长按的事件
//    var event = dms.createEvent("long:press", {"itemHref":itemHref, "openLinkWay":openLinkWay});
//    dms.dispatcher.dispatchEvent(event);
    //更改原来的长按事件，兼容
    var temp;
    for(var i = 0; i< o.length; i++){
        temp = o[i];
        dms.ActList[temp.type](temp.param);
    }

};