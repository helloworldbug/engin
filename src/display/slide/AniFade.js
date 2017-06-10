///**
// * Created by guyy on 2015/7/6.
// * Update by guyy on 2015/7/24
// * 页间移入动画之淡入淡出
// */
//dms.AniFade = function(_width,_height){
//    this.width = _width;
//    this.height = _height;
//    //以下动画私有属性初始化
//    this.opacity = 1;
//    this.slideDirection = dms.SlideGesture.ud;  //手势  上下
//    this.isMoveSpeedControl = true;             //是否移动控速
//    this.transformTime = 600;//淡入动画时间 单位：毫秒
//    this.fadeOutTime = 600;//淡出动画时间 单位：毫秒
//    this.fadeOutTime2 = 200;//淡出动画时间 单位：毫秒
//    this.transitionFunction = "linear";
//    this.transformFillMode = "forwards";
//    this.rate = 0.001;
//    this.pointer = {};
//    this.isLoop = true;
//    this.pageLength = 1;
//    this.index = 0;
//    this.y = this.height;
//    this.isSameAnimation = false;        //默认false
//}
////*****动画启动***************
////**参数说明：_slider:滑块集合
////************_activeContainer:当前滑块对象
////************_pointer:触发点对象
////************_isLoop:动物是否循环播放
////************_pageLength:滑块数量
////************_index:当前滑块索引 从0开始
////*****************************
//dms.AniFade.prototype.start = function(_slider,_activeContainer,_pointer,_isLoop,_pageLength,_index){
//    if(!_activeContainer || _activeContainer.length <= 0)return;
//    this.slider = _slider;
//    this.container = new dms.Container(_activeContainer[0]);
////    console.log($(_activeContainer[0]).attr("data-page-index"));
//    this.pointer = _pointer;
//    this.isLoop = _isLoop;
//    this.pageLength = _pageLength;
//    this.index = _index;
//    this.opacity = 1;
//    this.prev = null;
//    this.y = this.height;
//}
////*****动画启动***************
////**参数说明：_touch:移动触发点对象
////************ moveHandler:移动过程中方向变化回调
////**备注说明：只支持上下手势
////****************************
//dms.AniFade.prototype.move = function(_touch,moveHandler){
//    if(!this.container || !this.container.element)
//        return;
//    var distance = _touch.clientY - this.pointer.y;
//    if(distance < 0){ //向上滑
//        if (typeof (this.direction) === "undefined" || this.direction === "up") {
//            if (!this.isLoop && this.index === this.pagelength - 1) {
//                return;
//            }
//            this.y += distance;
//            this.opacity += distance * this.rate;
//            if(this.direction != "up")
//            {
//                this.direction = "up";
//                moveHandler && moveHandler(this.direction);
//            }
//        } else {
//            this.y -= distance;
//            this.opacity -= distance * this.rate;
//            if (this.opacity > 1) {
//                this.opacity = 1;
//                this.y = this.height;
//            }
//        }
//    }else if (distance > 0) { //向下滑
//        if (typeof (this.direction) === "undefined" || this.direction === "down") {
//            if (!this.isLoop && this.index === 0) {
//                return;
//            }
//            this.y -= distance;
//            this.opacity -= distance * this.rate;
//            if(this.direction != "down")
//            {
//                this.direction = "down";
//                moveHandler && moveHandler(this.direction);
//            }
//        } else {
//            this.y += distance;
//            this.opacity += distance * this.rate;
//            if (this.opacity > 1) {
//                this.opacity = 1;
//                this.y = this.height;
//            }
//        }
//    }
//    //缩放
//    if(distance != 0){
////        console.log("this.opacity="+Math.abs(this.opacity));
//        this.container.css2("opacity",Math.abs(this.opacity));
//    }
//    this.pointer.x = _touch.clientX, this.pointer.y = _touch.clientY;
//}
//dms.AniFade.prototype.end = function(_endHandler,_endHandler2,_endHandler3){
//    if (this.y === this.height) {
//        this.direction = undefined;
//        _endHandler3 && _endHandler3();
//        return; //防止按着不滑动就松手
//    }
//    _endHandler && _endHandler();
//    if(this.direction == "up"){
//        this.prev = $(this.container.element).next();
//        if(this.prev.length <= 0)
//            this.prev = this.slider.first();
//    }else{
//        this.prev = $(this.container.element).prev();
//        if(this.prev.length <= 0)
//            this.prev = this.slider.last();
//    }
//    this.prev = new dms.Container(this.prev[0]);
//    this.prev.css2("opacity","0");
//    this.container.css2("opacity","0");
//    this.container.css3("transition",this.fadeOutTime2/1000+"s");
//    var _this = this;
//    var t1 = setTimeout(function(){
//        _this.prev.removeClass("hide");
//        _this.prev.addClass("active show");
//        _this.prev.css3("animation","fadeIn22 "+(_this.fadeOutTime/1000)+"s "+_this.transitionFunction+" "+_this.transformFillMode);
//        var t = setTimeout(function(){
//            _this.container.addClass("hide");
//            _this.container.removeClass("show active");
//            _this.container.css3("transition","0s");
//            _this.container.css2("opacity","1");
//            _this.prev.css2("opacity","1");
//            _this.prev.css3("animation","");
//            _endHandler2 && _endHandler2();
//            //置空
//            _this.container && _this.container.destroy();
//            _this.container = null;
//            _this.prev && _this.prev.destroy();
//            _this.prev = null;
//            clearTimeout(t);
//        },_this.fadeOutTime);
//        clearTimeout(t1);
//    },this.fadeOutTime2);
//    this.y = this.height,this.direction = undefined;
//}
////滑动移入
//dms.AniFade.prototype.moveIn  = function(_container,callback){
//    this.container = new dms.Container(_container[0]);
//    var _this = this;
//    var t1 = setTimeout(function(){
//        _this.container.removeClass("hide");
//        _this.container.addClass("show active");
//        _this.container.css3("animation","fadeIn "+(_this.transformTime/1000)+"s "+_this.transitionFunction);
//        clearTimeout(t1);
//    },this.fadeOutTime-300);
//    var t = setTimeout(function(){
//        callback && callback("inEd");
//        _this.destroy();
//        clearTimeout(t);
//    },this.transformTime+this.fadeOutTime-300);
//}
////滑动移出
//dms.AniFade.prototype.moveOut = function(_container,callback){
//    this.container = new dms.Container(_container[0]);
//    this.container.css3("animation","fadeOut "+this.fadeOutTime/1000+"s");
//    var _this = this;
//    var t = setTimeout(function(){
//        callback && callback("outEd");
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        _this.destroy();
//        clearTimeout(t);
//    },this.fadeOutTime);
//}
////反方向滑动移入
//dms.AniFade.prototype.moveInReverse = function(_container,callback){
//    this.moveIn(_container,callback);
//}
////反方向滑动移出
//dms.AniFade.prototype.moveOutReverse = function(_container,callback){
//    this.moveOut(_container,callback);
//}
//dms.AniFade.prototype.destroy = function(){
//    this.container.css3('animation',"");
//    this.container.css3('transform',"translate3d(0,0,0)");
//    this.container.css3('transition',"0s");
//    this.container && this.container.destroy();
//    this.container = null;
//}