///**
// * Created by guyy on 2015/7/13
// * 页间动画之3D左右侧翻转
// */
//dms.AniLeftRight3D = function(_width,_height){
//    this.width = _width;
//    this.height = _height;
//    //以下动画私有属性初始化
//    this.slideDirection = dms.SlideGesture.lr;
//    this.opacity = 1;
//    this.transformTime = 1000;//动画时间 单位：毫秒
//    this.transitionFunction = "ease";  //  -webkit-animation-fill-mode: forwards;
//    this.isSameAnimation = true;        //默认false
//}
////移左
//dms.AniLeftRight3D.prototype.moveOutToUp = function(_container, _next, callback){
//    if(_container.length <= 0 || _next.length <=0){
//        debug.log("AniLeftRight3D->moveOutToUp()->dom not exists"+_container[0].length+","+_next[0].length);
//        return;
//    }
//    this.container = new dms.Container(_container[0]);
//    this.next = new dms.Container(_next[0]);
//    this.container.parentCss3("perspective","300px");
//    this.container.css3("animation","hide-right "+(this.transformTime/1000)+"s "+this.transitionFunction);
//    this.next.css3("animation","show-right "+(this.transformTime/1000)+"s "+this.transitionFunction);
//    this.next.removeClass("hide");
//    this.next.addClass("show active");
//    var _this = this;
//    var t = setTimeout(function(){
//        callback && callback();
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        _this.destroy();
//        clearTimeout(t);
//    },this.transformTime-200);
//}
////移右
//dms.AniLeftRight3D.prototype.moveOutToDown = function(_container, _next, callback){
//    if(_container.length <= 0 || _next.length <=0){
//        debug.log("AniLeftRight3D->moveOutToDown()->dom not exists"+_container[0].length+","+_next[0].length);
//        return;
//    }
//    this.container = new dms.Container(_container[0]);
//    this.next = new dms.Container(_next[0])
//    this.container.parentCss3("perspective","300px");
//    this.container.css3("animation","hide-left "+(this.transformTime/1000)+"s "+this.transitionFunction);
//    this.next.css3("animation","show-left "+(this.transformTime/1000)+"s "+this.transitionFunction);
//    this.next.removeClass("hide");
//    this.next.addClass("show active");
//    var _this = this;
//    var t = setTimeout(function(){
//        callback && callback();
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        _this.destroy();
//        clearTimeout(t);
//    },this.transformTime-200);
//}
////稍毁
//dms.AniLeftRight3D.prototype.destroy = function(){
//    this.container.parentCss3("perspective","0px");
//    this.container && this.container.css3("animation","");
//    this.next && this.next.css3("animation","")
//    this.container = null;
//    this.next = null;
//};