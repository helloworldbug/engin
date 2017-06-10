///**
// * Created by guyy on 2015/7/9.
// * 页间动画之3D上下旋转
// */
//dms.AniUpDown3D = function(_width,_height){
//    this.width = _width;
//    this.height = _height;
//    //以下动画私有属性初始化
//    this.slideDirection = dms.SlideGesture.ud;
//    this.isMoveSpeedControl = false;             //是否移动控速
//    this.scale = 1;
//    this.opacity = 1;
//    this.transformTimeForPC = 1000;//动画时间 单位：毫秒
//    this.transformTime = 1000;//动画时间 单位：毫秒
//    this.transitionFunction = "linear";
//    this.transformFillMode = "forwards";    //none /forwards	当动画完成后，保持最后一个属性值
//    this.isSameAnimation = true;        //默认false
//    this.trnZ = 0;
//    this.rate = 0.0005;
//    this.bgWidth = this.width;
//    this.bgHeight = this.height;
//    this.clipTop = 0;
//    this.clipRight = 0;
//    this.clipBottom = 0;
//    this.clipLeft = 0;
//    this.started = false;   //isMoveSpeedControl=true 可用
//}
//dms.AniUpDown3D.prototype.getR = function(){
//    //45 = 360/4/2
//    return (this.bgHeight/2)/Math.tan(45 / 180 * Math.PI);
//}
//dms.AniUpDown3D.prototype.clipReset = function(){
//    this.clipTop = new Number((this.height-this.bgHeight)/2).toFixed(1);
//    if(this.clipTop <0) this.clipTop = 0;
//    this.clipBottom = parseInt(this.clipTop)+this.bgHeight;
//    this.clipLeft = new Number((this.width-this.bgWidth)/2).toFixed(1);
//    if(this.clipLeft <0) this.clipLeft = 0;
//    this.clipRight = parseInt(this.clipLeft) + this.bgWidth;
//}
////*****动画启动***************isMoveSpeedControl=true可用未完善
////**参数说明：_slider:滑块集合
////************_activeContainer:当前滑块对象
////************_pointer:触发点对象
////************_isLoop:动物是否循环播放
////************_pageLength:滑块数量
////************_index:当前滑块索引 从0开始
////*****************************
//dms.AniUpDown3D.prototype.start = function(_slider,_activeContainer,_pointer,_isLoop,_pageLength,_index){
//    if(!_activeContainer || _activeContainer.length <= 0)return;
//    this.slider = _slider;
//    this.container = new dms.Container(_activeContainer[0]);
//    if(_activeContainer[0].querySelector(".magazine-page-container") && this.bgWidth != parseInt(_activeContainer[0].querySelector(".magazine-page-container").style.width))
//    {
//        this.bgWidth = parseInt(_activeContainer[0].querySelector(".magazine-page-container").style.width);
//        this.bgHeight = parseInt(_activeContainer[0].querySelector(".magazine-page-container").style.height);
//    }
//    this.clipReset();
//    if(this.trnZ === 0) this.trnZ = Math.floor(this.getR());
//    this.pointer = _pointer;
//    this.isLoop =  _isLoop;
//    this.pageLength = _pageLength;
//    this.index = _index;
//    this.y = 0;
//    this.scale = 1;
//    this.whiteSpace = 0;
//    this.prev = null;
//    this.rotateX = 0;
//    this.translateY = 0;
//    this.translateZ = 0;
//    this.started = true;
//}
////*****动画移动***************isMoveSpeedControl=true可用未完善
////**参数说明：_touch:移动触发点对象
////************ moveHandler:移动过程中方向变化回调
////**备注说明：只支持上下手势
////****************************
//dms.AniUpDown3D.prototype.move = function(_touch,moveHandler){
//    if(!this.container || !this.container.element)
//        return;
//    var distance = _touch.clientY - this.pointer.y;
//    if(distance < 0){ //向上滑
//        if (typeof (this.direction) === "undefined" || this.direction === "up") {
//            if (!this.isLoop && this.index == this.pageLength - 1) {
//                return;
//            }
//            this.prev = $(this.container.element).next();
//            this.y += distance;
//            this.scale += distance * this.rate;
//            if(this.direction != "up")
//            {
//                this.direction = "up";
//                moveHandler && moveHandler(this.direction);
//            }
//            this.rotateX++;//this.y/this.height * 90 * -1;
//            //显示下一张
//            if(this.prev.length <= 0)
//            {
//                this.prev = this.slider.first();
//            }
//            this.prev = new dms.Container(this.prev[0]);
//            this.prev.css2("clip", "rect(" + this.clipTop + "px," + this.clipRight + "px," + this.clipBottom + "px," + this.clipLeft + "px)");
//            this.prev.css3("transform","rotateX(-90deg) translateZ("+this.trnZ+"px)");
//            this.prev.removeClass("hide");
//            this.prev.addClass("show");
//        } else {
//            this.prev = $(this.container.element).prev();
//            this.y -= distance;
//            this.scale -= distance * this.rate;
//            if (this.scale >= 1) {
//                this.scale = 1;
//                this.y = this.height;
//            }
//            this.rotateX--;// =this.y/this.height * 90;
//            if(this.prev.length <= 0)
//            {
//                this.prev = this.slider.last();
//            }
//            this.prev = new dms.Container(this.prev[0]);
//            this.prev.css2("clip", "rect(" + this.clipTop + "px," + this.clipRight + "px," + this.clipBottom + "px," + this.clipLeft + "px)");
//            this.prev.css3("transform","rotateX(90deg) translateZ("+this.trnZ+"px)");
//            this.prev.removeClass("hide");
//            this.prev.addClass("show");
//        }
//    }
//    else if (distance > 0) { //向下滑
//        if (typeof (this.direction) === "undefined" || this.direction === "down") {
//            if (!this.isLoop && this.index === 0) {
//                return;
//            }
//            this.prev = $(this.container.element).prev();
//            this.y -= distance;
//            this.scale -= distance * this.rate;
//            this.rotateX--;// = this.y/this.height * 90;
//            if(this.direction != "down")
//            {
//                this.direction = "down";
//                moveHandler && moveHandler(this.direction);
//            }
//            if(this.prev.length <= 0)
//            {
//                this.prev = this.slider.last();
//            }
//            this.prev = new dms.Container(this.prev[0]);
//            this.prev.css2("clip", "rect(" + this.clipTop + "px," + this.clipRight + "px," + this.clipBottom + "px," + this.clipLeft + "px)");
//            this.prev.css3("transform","rotateX(90deg) translateZ("+this.trnZ+"px)");
//            this.prev.removeClass("hide");
//            this.prev.addClass("show");
//        } else {
//            this.prev = $(this.container.element).next();
//            this.y += distance;
//            this.scale += distance * this.rate;
//            if (this.scale >= 1) {
//                this.scale = 1;
//                this.y = this.height;
//            }
//            this.rotateX++;// = this.y/this.height * 90*-1;
//            if(this.prev.length <= 0)
//            {
//                this.prev = this.slider.first();
//            }
//            //显示上一张
//            this.prev = new dms.Container(this.prev[0]);
//            this.prev.css2("clip", "rect(" + this.clipTop + "px," + this.clipRight + "px," + this.clipBottom + "px," + this.clipLeft + "px)");
//            this.prev.css3("transform","rotateX(-90deg) translateZ("+this.trnZ+"px)");
//            this.prev.removeClass("hide");
//            this.prev.addClass("show");
//        }
//    }
//    //缩放
//    if(distance != 0 && this.rotateX != 0) {
//        if(this.started) {
//            //初次设置3d空间
//            this.container.css2("clip", "rect(" + this.clipTop + "px," + this.clipRight + "px," + this.clipBottom + "px," + this.clipLeft + "px)");
//            this.container.parentCss3("transform", "rotateX(0deg) translateZ(-" + this.trnZ + "px)");
//            this.container.css3d(this.transformTime / 1000);
//            this.started = false;
//        }
//        this.container.css3("transform","rotateX(0deg) translateZ("+this.trnZ+"px)");
//        this.rotateX = Math.floor(this.rotateX);
//        this.rotateX = Math.min(90,this.rotateX);
//        this.rotateX = Math.max(-90,this.rotateX);
////        if(this.rotateX > 0)
////            this.rotateX += 40;
////        if(this.rotateX < 0)
////            this.rotateX -= 40;
//        if(Math.abs(this.rotateX) <= 65){
//            this.translateY = this.rotateX/45 * this.trnZ*-1+200;
//            this.translateZ = -this.trnZ;
//        }else{
//            this.translateY = -this.trnZ+200;
//            this.translateZ = (this.trnZ - (Math.abs(this.rotateX-45)/45 * this.trnZ))*-1;
//        }
//        this.container.parentCss3("transform","rotateX(-"+this.rotateX+"deg) translateY(-200px) translateZ(-"+this.trnZ+"px)");// translateZ("+this.translateZ+"px) translateY("+this.translateY+"px)");
//    }
//    this.pointer.x = _touch.clientX, this.pointer.y = _touch.clientY;
//}
////*****动画结束***************isMoveSpeedControl=true可用未完善
////**参数说明：_touch:移动触发点对象
////************ moveHandler:移动过程中方向变化回调
////**备注说明：只支持上下手势
////****************************
//dms.AniUpDown3D.prototype.end = function(_endHandler,_endHandler2,_endHandler3){
//    this.started = false;
//    if(!this.container || !this.container.element)
//        return;
//    if (this.y == this.height || this.y == 0) {
//        if(this.prev){
//            this.prev.addClass("hide");
//            this.prev.removeClass("show");
//            this.prev.css2("clip","auto");
//        }
//        this.container.parentCss3("transform-style","flat");
//        this.container.parentCss3("transform","rotateX(0deg) translateZ(0px) translateY(0px)");
//        this.container.css2("clip","auto");
//        this.direction = undefined;
//        _endHandler3 && _endHandler3();
//        return; //防止按着不滑动就松手
//    }
//    _endHandler && _endHandler();
//    this.container.parentCss3("animation-fill-mode",this.transformFillMode);
//    if(this.direction == "up")
//        this.container.parentCss3("transform","rotateX(90deg) translateY(-"+this.trnZ+"px)");
//    else{
//        this.container.parentCss3("transform","rotateX(-90deg) translateY("+this.trnZ+"px)");
//    }
//    var _this = this;
//    var t = setTimeout(function () {
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        _this.prev.addClass("active");
//        _endHandler2 && _endHandler2();
//        _this.destroy3();
//        clearTimeout(t);
//    }, this.transformTime);
//    this.y = 0,this.direction = undefined,this.translateY = 0,this.translateZ = 0,this.rotateX = 0,this.scale = 1;
//}
//////******整合动画->向上滚动**************this.isSameAnimation=true用
//dms.AniUpDown3D.prototype.moveOutToUp = function(_container,_next,callback){
//    if(_container.length <= 0 || _next.length <= 0){
//        debug.log("AniUpDown3D->moveOutToUp()->dom not exists"+_container[0].length+","+_next[0].length);
//        return;
//    }
//    if(_container[0].querySelector(".magazine-page-container") && this.bgWidth != parseInt(_container[0].querySelector(".magazine-page-container").style.width))
//    {
//        this.bgWidth = parseInt(_container[0].querySelector(".magazine-page-container").style.width);
//        this.bgHeight = parseInt(_container[0].querySelector(".magazine-page-container").style.height);
//    }
//    this.clipReset();
//    this.container = new dms.Container(_container[0]);
//    this.next = new dms.Container(_next[0]);
//    if(this.trnZ === 0) this.trnZ = Math.floor(this.getR());
//    this.container.css2("clip","rect("+this.clipTop+"px,"+this.clipRight+"px,"+this.clipBottom+"px,"+this.clipLeft+"px)");
//    this.next.css2("clip","rect("+this.clipTop+"px,"+this.clipRight+"px,"+this.clipBottom+"px,"+this.clipLeft+"px)");
//    this.container.css3d(this.transformTimeForPC/1000);
//    this.container.css3("transform","rotateX(0deg) translateZ("+this.trnZ+"px)");
//    this.container.parentCss3("transform","rotateX(0deg) translateZ(-"+this.trnZ+"px)");
//    this.next.css3("transform","rotateX(-90deg) translateZ("+this.trnZ+"px)");
//    this.next.removeClass("hide");
//    this.next.addClass("show active");
//    this.container.parentCss3("animation","toUp3d "+(this.transformTimeForPC/1000)+"s "+this.transitionFunction+" "+this.transformFillMode);
//    var _this = this;
//    var t = setTimeout(function(){
//        callback && callback();
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        _this.destroy2();
//        clearTimeout(t);
//    },this.transformTimeForPC-100);
//};
//
//////******整合动画->向下滚动**************this.isSameAnimation=true用
//dms.AniUpDown3D.prototype.moveOutToDown = function(_container,_next,callback){
//    if(_container.length <= 0 || _next.length <= 0){
//        debug.log("AniUpDown3D->moveOutToDown()->dom not exists"+_container[0].length+","+_next[0].length);
//        return;
//    }
//    if(_container[0].querySelector(".magazine-page-container") && this.bgWidth != parseInt(_container[0].querySelector(".magazine-page-container").style.width))
//    {
//        this.bgWidth = parseInt(_container[0].querySelector(".magazine-page-container").style.width);
//        this.bgHeight = parseInt(_container[0].querySelector(".magazine-page-container").style.height);
//    }
//    this.clipReset();
//    this.container = new dms.Container(_container[0]);
//    this.next = new dms.Container(_next[0]);
//    if(this.trnZ === 0) this.trnZ = Math.floor(this.getR());
//    this.container.css2("clip","rect("+this.clipTop+"px,"+this.clipRight+"px,"+this.clipBottom+"px,"+this.clipLeft+"px)");
//    this.next.css2("clip","rect("+this.clipTop+"px,"+this.clipRight+"px,"+this.clipBottom+"px,"+this.clipLeft+"px)");
//    this.container.parentCss3("transform","rotateX(0deg) translateZ(-"+this.trnZ+"px)");
//    this.container.css3("transform","rotateX(0deg) translateZ("+this.trnZ+"px)");
//    this.next.css3("transform","rotateX(90deg) translateZ("+this.trnZ+"px)");
//    this.container.css3d(this.transformTimeForPC/1000);
//    this.next.removeClass("hide");
//    this.next.addClass("show active");
//    this.container.parentCss3("animation","toDown3d "+(this.transformTimeForPC/1000)+"s "+this.transitionFunction+" "+this.transformFillMode);
//    var _this = this;
//    var t = setTimeout(function(){
//        callback && callback();
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        _this.destroy2();
//        clearTimeout(t);
//    },this.transformTimeForPC-100);
//};
//dms.AniUpDown3D.prototype.destroy2 = function(){
//    this.container.css2d();
//    this.container.parentCss3("animation","");
//    this.container.parentCss3("transform","rotateX(0deg) translateZ(0px)");
//    this.container.css3("transform","rotateX(0deg) translateZ("+this.trnZ+"px)");
//    this.next.css3("transform","rotateX(0deg) translateZ("+this.trnZ+"px)");
//    this.container.css2("clip","auto");
//    this.next.css2("clip","auto");
//    this.container = null;
//    this.next = null;
//}
//dms.AniUpDown3D.prototype.destroy3 = function(){
//    this.container.parentCss3("transform-style","flat");
//    this.container.parentCss3("transform","rotateX(0deg) translateZ(0px) translateY(0px)");
//    this.container.parentCss3("transition","all 0s");
//    this.container.css3("transform","rotateX(0deg) translateZ("+this.trnZ+"px)");
//    this.prev.css3("transform","rotateX(0deg) translateZ("+this.trnZ+"px)");
//    this.container.css2("clip","auto");
//    this.prev.css2("clip","auto");
//    this.container = null;
//    this.prev = null;
//}
//dms.AniUpDown3D.prototype.destroy = function(){
//      this.container.parentCss3("transform-style","flat");
//      this.container.parentCss3("animation","");
//      this.container.css3("transform","rotateX(0deg) translateZ("+this.trnZ+"px)");
//      this.container = null;
//};