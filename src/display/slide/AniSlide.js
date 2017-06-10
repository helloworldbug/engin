///**
// * Created by guyy on 2015/7/6.
// * 页间移入动画之滑动移入移出
// */
//dms.AniSlide = function(_width,_height){
//    this.width = _width;
//    this.height = _height;
//    //以下动画私有属性初始化
//    this.slideDirection = dms.SlideGesture.ud;
//    this.isMoveSpeedControl = true;             //是否移动控速  ;
//    this.transformTime = 250;//动画时间 单位：毫秒
//    this.transformTimeForPC = 1000;//动画时间 单位：毫秒
//    this.transitionFunction = "ease-out";
//    this.transformFillMode = "forwards";// none /forwards	当动画完成后，保持最后一个属性值
//    this.isSameAnimation = false;        //默认false
//    this.pointer = {};
//    this.isLoop = true;
//    this.pageLength = 1;
//    this.index = 0;
//    this.scale = 1;
//    this.rate = 0.0005;
//    this.x = this.width;
//    this.y = this.height;
//}
////*****动画启动***************
////**参数说明：_slider:滑块集合
////************_activeContainer:当前滑块对象
////************_pointer:触发点对象
////************_isLoop:动物是否循环播放
////************_pageLength:滑块数量
////************_index:当前滑块索引 从0开始
////*****************************
//dms.AniSlide.prototype.start = function(_slider,_activeContainer,_pointer,_isLoop,_pageLength,_index){
//    if(!_activeContainer || _activeContainer.length <= 0)return;
//    this.slider = _slider;
//    this.container = new dms.Container(_activeContainer[0]);
//    this.pointer = _pointer;
//    this.isLoop = _isLoop;
//    this.pageLength = _pageLength;
//    this.index = _index;
//    this.y = this.height;
//    this.x = this.width;
//    this.scale = 1;
//    this.whiteSpace = 0;
//    this.prev = null;
//}
////*****动画启动***************
////**参数说明：_touch:移动触发点对象
////************ moveHandler:移动过程中方向变化回调
////**备注说明：只支持上下手势
////****************************
//dms.AniSlide.prototype.move = function(_touch,moveHandler){
//    if(!this.container || !this.container.element)
//        return;
//    var distance = _touch.clientY - this.pointer.y;
//    if(distance < 0){ //向上滑
//        if (typeof (this.direction) === "undefined" || this.direction === "up") {
//            if (!this.isLoop && this.index === this.pagelength - 1) {
//                return;
//            }
//            this.prev = $(this.container.element).next();
//            this.y += distance;
//            this.scale += distance * this.rate;
//            this.whiteSpace = (this.height - this.y)*-1;
//            if(this.direction != "up")
//            {
//                this.direction = "up";
//                moveHandler && moveHandler(this.direction);
//            }
//            //显示下一张
//            if(this.prev.length <= 0)
//            {
//                this.prev = this.slider.first();
//            }
//            this.prev = new dms.Container(this.prev[0]);
//            this.prev.css3("transform","translate3d(0,"+this.y+"px,0)");
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
//            this.whiteSpace = this.height - this.y;
//            if(this.prev.length <= 0)
//            {
//                this.prev = this.slider.last();
//            }
//            this.prev = new dms.Container(this.prev[0]);
//            this.prev.css3("transform","translate3d(0,-"+this.y+"px,0)");
//            this.prev.removeClass("hide");
//            this.prev.addClass("show");
//        }
//    }else if (distance > 0) { //向下滑
//        if (typeof (this.direction) === "undefined" || this.direction === "down") {
//            if (!this.isLoop && this.index === 0) {
//                return;
//            }
//            this.prev = $(this.container.element).prev();
//            this.y -= distance;
//            this.scale -= distance * this.rate;
//            this.whiteSpace = this.height - this.y;
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
//            this.prev.css3("transform","translate3d(0,-"+this.y+"px,0)");
////            this.prev.css2("z-index","101");
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
//            this.whiteSpace = (this.height - this.y) * -1;
//            if(this.prev.length <= 0)
//            {
//                this.prev = this.slider.first();
//            }
//            //显示上一张
//            this.prev = new dms.Container(this.prev[0]);
//            this.prev.css3("transform","translate3d(0,"+this.y+"px,0)");
//            this.prev.removeClass("hide");
//            this.prev.addClass("show");
//        }
//    }
//    //缩放
//    if(distance != 0)
//        this.container.css3("transform","translate3d(0," + this.whiteSpace + "px,0)");
//    this.pointer.x = _touch.clientX, this.pointer.y = _touch.clientY;
//}
//dms.AniSlide.prototype.end = function(_endHandler,_endHandler2,_endHandler3){
//    if(!this.container || !this.container.element)
//        return;
//    if (this.y == this.height) {
//        if(this.prev){
//            this.prev.addClass("hide");
//            this.prev.removeClass("show");
//        }
//        this.direction = undefined;
//        _endHandler3 && _endHandler3();
//        return; //防止按着不滑动就松手
//    }
//    _endHandler && _endHandler();
//    if(this.direction == "up")
//        this.container.css3("transform","translate3d(0,-"+this.height+"px,0)");
//    else
//        this.container.css3("transform","translate3d(0,"+this.height+"px,0)");
//    this.container.css3("transition",this.transformTime/1000+"s "+this.transitionFunction);
//    this.prev.css3("transform","translate3d(0,0,0)");
//    this.prev.css3("transition",this.transformTime/1000+"s "+this.transitionFunction);
//    var _this = this;
//    var t = setTimeout(function(){
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        _this.container.css3("transition","0s");
//        _this.prev.addClass("active");
//        _this.prev.css3("transition","0s");
//        _endHandler2 && _endHandler2();
//        //置空
//        _this.container && _this.container.destroy();
//        _this.container = null;
//        _this.prev && _this.prev.destroy();
//        _this.prev = null;
//        clearTimeout(t);
//    },this.transformTime);
//    this.y = this.height,this.scale = 1, this.direction = undefined;
//}
////滑动移入
//dms.AniSlide.prototype.moveIn  = function(_container,callback){
//    this.container = new dms.Container(_container[0]);
//    this.container.y = this.height;
//    this.container.css3("animation","slideInUp "+this.transformTimeForPC/1000+"s "+this.transformFillMode);
//    this.container.removeClass("hide");
//    this.container.addClass("show active");
//    var _this = this;
//    var t = setTimeout(function(){
//        callback && callback("inEd");
//        _this.destroy();
//        clearTimeout(t);
//    },this.transformTimeForPC);
//
//}
////滑动移出
//dms.AniSlide.prototype.moveOut = function(_container,callback){
//    this.container = new dms.Container(_container[0]);
//    this.container.css3("transition",this.transformTimeForPC/1000+"s "+this.transitionFunction);
//    this.container.y = -this.height;
//    var _this = this;
//    var t = setTimeout(function(){
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        callback && callback("outEd");
//        _this.destroy();
//        clearTimeout(t);
//    },this.transformTimeForPC);
//}
////反方向滑动移入
//dms.AniSlide.prototype.moveInReverse = function(_container,callback){
//    this.container = new dms.Container(_container[0]);
//    this.container.y = -this.height;
//    this.container.css3("animation","slideInDown "+this.transformTimeForPC/1000+"s "+this.transformFillMode);
//    this.container.removeClass("hide");
//    this.container.addClass("show active");
//    var _this = this;
//    var t = setTimeout(function(){
//        callback && callback("inEd");
//        _this.destroy();
//        clearTimeout(t);
//    },this.transformTimeForPC);
//}
////反方向滑动移出
//dms.AniSlide.prototype.moveOutReverse = function(_container,callback){
//    this.container = new dms.Container(_container[0]);
//    this.container.css3("transition",this.transformTimeForPC/1000+"s "+this.transitionFunction);
//    this.container.y = this.height;
//    var _this = this;
//    var t = setTimeout(function(){
//        _this.container.addClass("hide");
//        _this.container.removeClass("show active");
//        callback && callback("outEd");
//        _this.destroy();
//        clearTimeout(t);
//    },this.transformTimeForPC);
//}
//dms.AniSlide.prototype.destroy = function(){
//    this.container.css3('animation',"");
//    this.container.css3('transform',"translate3d(0,0,0)");
//    this.container.y = 0;
//    this.container.css3('transition',"all 0s linear");
//    this.container && this.container.destroy();
//    this.container = null;
//}