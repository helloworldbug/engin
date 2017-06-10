///**
// * Created by guyy on 2015/7/23
// * 页间动画之开门动画
// */
//dms.AniOpenDoor = function(_width,_height){
//    this.width = _width;
//    this.height = _height;
//    //以下动画私有属性初始化
//    this.slideDirection = dms.SlideGesture.lr;
//    this.isMoveSpeedControl = false;             //是否移动控速
//    this.scale = 1;
//    this.opacity = 1;
//    this.transformTime = 800;//动画时间 单位：毫秒
//    this.transformTime2 = 100;//右边门打开延迟时间 单位：毫秒
//    this.transitionFunction = "ease-out";
//    this.transitionFunction2 = "ease-in";
//    this.transformFillMode = "forwards";// none /forwards	当动画完成后，保持最后一个属性值
//    this.isSameAnimation = true;        //默认false
//}
////***********上翻开门动画**********
//dms.AniOpenDoor.prototype.moveOutToUp = function(_container,_next,callback){
//    if(_container.length <= 0 || _next.length <=0){
//        debug.log("AniOpenDoor->moveOutToUp()->dom not exists"+_container[0].length+","+_next[0].length);
//        return;
//    }
//    this.container = new dms.Container(_container[0]);
//    //复制移出对象
//    var ele = _container[0].cloneNode(true);
//    _container[0].parentNode.appendChild(ele);
//    this.copy = new dms.Container(ele);
//    this.next = new dms.Container(_next[0]);
//    //层级关系
//    this.copy.css2("z-index","101");
//    this.container.css2("z-index","101");
//    this.next.css2("z-index","100");
//    //左半边
//    this.container.css2("clip","rect(0px,"+(this.width/2)+"px,"+this.height+"px,0px)");
//    //右半边
//    this.copy.css2("clip","rect(0px,"+this.width+"px,"+this.height+"px,"+this.width/2+"px)");
//    //移除复制项的className以消除动画
//    var imgList = this.copy.element.getElementsByClassName("animated");
//    for(var i = 0; i < imgList.length; i++)
//    {
//        if(imgList[i] && imgList[i].className.indexOf("animated") >= 0)
//            imgList[i].className = "";
//    }
//    this.copy.css2("-webkit-transition","-webkit-transform "+this.transformTime/1000+"s "+this.transitionFunction);
//    this.copy.css2("transition","transform "+this.transformTime/1000+"s "+this.transitionFunction);
//    this.container.css2("-webkit-transition","-webkit-transform "+this.transformTime/1000+"s "+this.transitionFunction);
//    this.container.css2("transition","transform "+this.transformTime/1000+"s "+this.transitionFunction);
//    var _this = this;
//    var t = setTimeout(function(){
//        _this.container.css3("transform","translate3d(-50%,0,0)");
//        _this.copy.css3("transform","translate3d(50%,0,0)");
//        _this.next.removeClass("hide");
//        _this.next.addClass("show active");
//        _this.next.css3("animation","zoomInForDoor "+(_this.transformTime/1000)+"s "+_this.transitionFunction+" "+_this.transformFillMode);
//        var t1 = setTimeout(function(){
//            _this.container.removeClass("show active");
//            _this.container.addClass("hide");
//            ele && ele.parentNode.removeChild(ele);
//            _this.destroy();
//            callback && callback();
//            clearTimeout(t1);
//        },_this.transformTime);
//        clearTimeout(t);
//    },this.transformTime2);
//};
////***********下翻普通动画**********
//dms.AniOpenDoor.prototype.moveOutToDown = function(_container,_next,callback){
//    if(_container[0].length <= 0 || _next[0].length <= 0)
//    {
//        debug.log("AniOpenDoor->moveOutToDown()->dom not exists"+_container[0].length+","+_next[0].length);
//        return;
//    }
//    this.container = new dms.Container(_container[0]);
//    this.next = new dms.Container(_next[0]);
//    //复制移入对象
//    var ele = _next[0].cloneNode(true);
//    _next[0].parentNode.appendChild(ele);
//    this.copy = new dms.Container(ele);
//    //层级关系
//    this.container.css2("z-index","100");
//    this.copy.css2("z-index","101");
//    this.next.css2("z-index","101");
//    this.next.removeClass("hide");
//    this.next.addClass("show active");
//    this.copy.removeClass("hide");
//    this.copy.addClass("show active");
//    //左半边
//    this.next.css2("clip","rect(0px,"+(this.width/2)+"px,"+this.height+"px,0px)");
//    //右半边
//    this.copy.css2("clip","rect(0px,"+this.width+"px,"+this.height+"px,"+(this.width/2)+"px)");
//    this.next.css3("transform","translate3d(-50%,0,0)");
//    this.copy.css3("transform","translate3d(50%,0,0)");
////    this.stopAnimation($(this.copy.element));
//    var _this = this;
//    var t2 = setTimeout(function(){
//        _this.next.css2("-webkit-transition","-webkit-transform "+(_this.transformTime/1000)+"s "+_this.transitionFunction2);
//        _this.next.css2("transition","transform "+(_this.transformTime/1000)+"s "+_this.transitionFunction2);
//        _this.copy.css2("-webkit-transition","-webkit-transform "+(_this.transformTime/1000)+"s "+_this.transitionFunction2);
//        _this.copy.css2("transition","transform "+(_this.transformTime/1000)+"s "+_this.transitionFunction2);
//        _this.container.css3("animation","zoomOutForDoor "+(_this.transformTime/1000)+"s "+_this.transitionFunction+" "+_this.transformFillMode);
//        var t = setTimeout(function(){
//            _this.next.css3("transform","translate3d(0,0,0)");
//            _this.copy.css3("transform","translate3d(0,0,0)");
//            var t1 = setTimeout(function(){
////                _this.startAnimation($(_this.copy.element));
//                _this.container.removeClass("show active");
//                _this.container.addClass("hide");
//                ele && ele.parentNode.removeChild(ele);
//                _this.destroy();
//                callback && callback();
//                clearTimeout(t1);
//            },_this.transformTime);
//            clearTimeout(t);
//        },_this.transformTime2);
//        clearTimeout(t2);
//    },_this.transformTime2);
//}
//    //暂停_dom下所有动画类
//dms.AniOpenDoor.prototype.stopAnimation = function(_dom){
//    var aniList = _dom.find(".animated");
//    for(var i = 0; i < aniList.length; i++)
//    {
//        if(aniList[i] && aniList[i].className.indexOf("animated") >= 0) {
//            $(aniList[i]).attr("preClassName",aniList[i].className);
//            $(aniList[i]).attr("class","").addClass("animated");
//        }
//    }
//};
////开启_dom下所有动画类
//dms.AniOpenDoor.prototype.startAnimation = function(_dom){
//    var aniList = _dom.find(".animated");
//    for(var i = 0; i < aniList.length; i++)
//    {
//        debug.log(i+"前="+$(aniList[i]).attr("class"));
//        $(aniList[i]).attr("class",$(aniList[i]).attr("preClassName"));
//        debug.log(i+"后="+$(aniList[i]).attr("class"));
//    }
//}
//dms.AniOpenDoor.prototype.destroy = function(){
//      this.container.css2("-webkit-transition","all 0 ease 0");
//      this.container.css2("transition","all 0 ease 0");
//      this.container.css3("transform","translate3d(0,0,0)");
//      this.container.css3("animation","");
//      this.container.css2("clip","auto");
//      this.next.css2("-webkit-transition","all 0 ease 0");
//      this.next.css2("transition","all 0 ease 0");
//      this.next.css3("transform","translate3d(0,0,0)");
//      this.next.css3("animation","");
//      this.next.css2("clip","auto");
//      this.container.css2("z-index","100");
//      this.copy = null;
//      this.container = null;
//};