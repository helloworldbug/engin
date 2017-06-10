// 文件名称: dms.RenderObject
//
// 创 建 人: chenshy
// 创建日期: 2015/6/12 11:45
// 描    述: 渲染对象
(function(dms){
    var RenderObject = dms.RenderObject = function(){
        dms.DisplayObject.call(this);
        /**旋转绽放的容器**/
        this.transformElement = document.createElement("div");
        if(!this.contentElement){
            /**显示内容的容器**/
            this.contentElement = document.createElement("div");
        }

        this.userObject = {};

        this.transformElement.appendChild(this.contentElement);
        this.element.appendChild(this.transformElement);

        this.pp3D(this.contentElement);
        this.contentElement.style.position = "relative";
        // this.contentElement.style.transformOrigin = "50% 50% 0";
        this.transformElement.style.position = "relative";
//    this.transformElement.style.transform = "translate3d(50%,50%,0%)"

        this._translateXPercent = 0;
        this._translateYPercent = 0;

        this._sx = 0;
        this._sy = 0;
        this._sScaleX = 1;
        this._sScaleY = 1;
        this._sScaleZ = 1;
        this._sRotateX = 0;
        this._sRotateY = 0;
        this._sRotateZ = 0;

        this._contentWidth = 0;
        this._contentHeight = 0;

        this._onClick = null;
        this._listneEvent = dms.getEventName();

        this.$el = $(this.element);

        this._animationIndex = 0;

        //事件列表
        this.eventList = {};

        this._animateClassObjects = [];
    };

    dms.inherit(dms.RenderObject,dms.DisplayObject);

    dms.RenderObject.prototype.setContentWidth = function(value){
        this._contentWidth = value;
        this.contentElement.style.width = value + "px";
    }
    dms.RenderObject.prototype.setContentHeight = function(value){
        this._contentHeight = value;
        this.contentElement.style.height = value + "px";
    }
    dms.RenderObject.prototype.setScale = function(x,y){
        if(!this._translateXPercent){
            this._translateXPercent = ((x - 1) / 2 * 100);
            this._translateYPercent = ((y - 1) / 2 * 100);
        }
        this._sScaleX = x;
        this._sScaleY = y;
        this.elementTransform();
    }
    dms.RenderObject.prototype.setRotate = function(x,y,z){
        this._sRotateX = x;
        this._sRotateY = y;
        this._sRotateZ = z;
        this.elementTransform();
    }
    dms.RenderObject.prototype.elementTransform = function(){
        var xPercent =  (this._translateXPercent) + '%';
        var yPercent = (this._translateYPercent) + '%';
        // var translate = 'translate3d(' + (this._translateXPercent) + '%,' + (this._translateYPercent) + '%, ) ';
        var translate = ' translateX(' + (this._translateXPercent) + '%) translateY(' + (this._translateYPercent) + '%) ';
        var rotate = 'rotateX(' + this._sRotateX + 'deg) ' + 'rotateY(' + this._sRotateY + 'deg) ' + 'rotateZ(' + this._sRotateZ + 'deg) ';
        var scale = 'scale3d(' + this._sScaleX + ',' + this._sScaleY + ',' + this._sScaleZ + ') ';
//    var skew = 'skew(' + this.skewX + 'deg,' + this.skewY + 'deg)';
//    console.log("transform",translate + rotate + scale);
//    this.transformElement.style["-webkit-transform"] =
//    this.transformElement.style.transform = translate + rotate + scale + " !important";
        dms.Css.css3(this.transformElement,'transform', translate + rotate + scale);
        // dms.Css.css3(this.transformElement,'transform', scale);
        // dms.Css.css3(this.transformElement,'transform', rotate) ;
//    console.log(translate);
//    this.transformElement.style.transform = rotate + scale;// + rotate + scale;
    }


    dms.RenderObject.prototype.destroy = function(){
        this.$el.unbind(this._listneEvent);
        this._onClick = null;
        if(this.userObject){
            this.userObject.magazineDisplay = null;
            delete this.userObject.magazineDisplay;
            this.userObject = null;
        }

        $(this.contentElement).off("webkitAnimationEnd");
//    this.onClick = null;
        dms.DisplayObject.prototype.destroy.call(this);
    };

    Object.defineProperties(dms.RenderObject.prototype,{
        onClick: {
            set: function(fn){
                if(!this._onClick){
                    this._onClick = fn.bind(this);
                    this.$el.on(this._listneEvent,this._onClick);
                }else{
                    this.$el.unbind(this._listneEvent,this._onClick);
                    this._onClick = null;
                    this._onClick = fn.bind(this);
                    this.$el.on(this._listneEvent,this._onClick);
                }
            }
        },
        userData: {
            get: function(){
                return this._userData;
            },
            set: function(data){
                this._userData = data;
            }
        },
        dataItemHref: {
            set: function(href){
                var el = this.contentElement;
                el.style.pointerEvents = "auto";    //为了图片可以点击
                if(href){
                    this.eventList = dms.EventParser(href);
                }
                //el.setAttribute("data-item-href", href);
            }
        },
        flipEle :{
            set: function(obj){
                //设置水平镜像
                var flipped = "", flippedIE = "";
                if(obj.flippedX){
                    flipped = "scaleX(-1)";
                    flippedIE = "fliph";  /*IE*/
                }
                //设置处置镜像
                if(obj.flippedY){
//                scaleY = scaleY*(-1);
                    flipped += " scaleY(-1)";
                    flippedIE += " flipv";  /*IE*/
                }
                if(flipped){
                    var el = document.createElement("div");
                    var style = el.style;
                    style.position = "relative";
                    //modify by fishYu 2016-4-21 14:26 把设置在contentElement 更换为element
                    style.MozTransform = flipped;
                    style.WebkitTransform = flipped;
                    style.OTransform = flipped;
                    style.transform = flipped;
                    style.filter = flippedIE;  /*IE*/
                    el.appendChild(this.contentElement);
                    this.transformElement.appendChild(el);
                }
            }
        }
    });

    //dms.RenderObject.prototype.__defineSetter__('onClick',function(fn){
    //    if(!this._onClick){
    //        this._onClick = fn.bind(this);
    //        this.$el.on(this._listneEvent,this._onClick);
    //    }else{
    //        this.$el.unbind(this._listneEvent,this._onClick);
    //        this._onClick = null;
    //        this._onClick = fn.bind(this);
    //        this.$el.on(this._listneEvent,this._onClick);
    //    }
    //});
    //
    ///**
    // * 设置用户数据
    // */
    //dms.RenderObject.prototype.__defineGetter__('userData',function(){
    //    return this._userData;
    //});
    //
    //dms.RenderObject.prototype.__defineSetter__('userData',function(data){
    //    this._userData = data;
    //});

    dms.RenderObject.prototype.dmsStage = null;

    //dms.RenderObject.prototype.__defineSetter__('dataItemHref',function(href){
    //    var el = this.contentElement;
    //    el.style.pointerEvents = "auto";    //为了图片可以点击
    //    el.setAttribute("data-item-href", href);
    //});

    dms.RenderObject.createObject = function(item){
        var displayObject = new dms.RenderObject();
        displayObject.userData = item;


        displayObject.uid = (item.item_id || dms.getNewID()) + "";
        return displayObject;
    };

    /**
     * 设置元素的属性
     * 子类可重写该方法，实现片定义设置属性，如设置坐标、颜色、旋转等
     */
    dms.RenderObject.prototype.resetAttribute = function(){
        if(this.userData){
//        this.regX = 0;
//        this.regY = 0;


            this._cyanAnimationScript = null;



            var data = this.userData;
            var el = this.contentElement;
            var ele = this.element;
            var style = el.style;
//        el.style["-webkit-transform-origin"] = "";
//        el.style["transform-origin"] = "";
//
//        //坐标
            this.left = data.item_left;
            this.top  = data.item_top;

            this.element.setAttribute("o-left",data.item_left);
            this.element.setAttribute("o-top" ,data.item_top);

            //元素的显示状态
            var displayStatus = data.item_display_status;
            if(displayStatus == 1){ //表示隐藏
                this.element.style.display = "none";
            }else{
                this.element.style.display = "block";
            }
//
////        console.log("df");
////        this.x = data.item_left;
////        this.y = data.item_top;
//
//        //旋转
            var rotateAngle = data.rotate_angle;
//        this.rotation = rotateAngle;
            this.setRotate(0,0,rotateAngle);

////        this.rotationX = this.rotationY = rotateAngle;
//
            var scaleX = data.x_scale;
            var scaleY = data.y_scale;
            //add by fishYu 2016-3-15 15:12设置所有元素的镜像属性
            var itemMirror = data.item_mirror;  //镜像值是个json字符串
            if(itemMirror && itemMirror != 'null' && itemMirror != 'undefined' && dms.isJsonObject(itemMirror)){
                itemMirror = dms.toJSON(itemMirror);
                //TODO 可能会和时间轴有冲突， modify by fishYu 2016-4-28 14:34 增加镜像的时候多添加一层,第三次为镜像层
                this.flipEle = itemMirror;
            }
//        this.scaleX = scaleX;
//        this.scaleY = scaleY;
            this.setScale(scaleX,scaleY);
//        //透明度  兼容之前多图透明度为1的作品
            this.alpha = (  data.item_opacity == 1 ? 100 : data.item_opacity) / 100;

//
            //增加所有链接地址
            var itemHref = data.item_href;
            var itemType = data.item_type;	//过滤掉视频的item_href, 和涂抹的item_href,和长按的item_href, 假话29,密码31的时候, 36打赏 37图集元素 41红包 无限回答42  && itemType != 25 360全景40过滤掉
            //modify by fishYu 2016-4-18 过滤 "none"的值
            if(itemHref && itemHref !="none" && itemType != 8 && itemType != 24  && itemType != 29 && itemType != 31 && itemType != 36 && itemType != 37 && itemType != 40  && itemType != 41 && itemType != 42){
                if(itemHref.indexOf("none|") < 0) {  //过滤"none|none"
                    this.dataItemHref = itemHref;
                }
                //add by fishYu 2016-4-8 20:04 如果元素上有事件滑动的事件，就阻止翻页,
                if(itemHref.indexOf("Swipe") > -1){
                    el.setAttribute("can-swipe", "no");
                }else{
                    el.setAttribute("can-swipe", "yes");
                }
                //todo  样式已经添加
                //modify by fishYu 2016-7-1 10:33 制作时添加可点击元素，在手机预览时给出点选状态 状态为元素本身透明度80%  点击
                el.setAttribute("data-click", "common-opacity");
                //modify by fishYu 2016-7-5 14:59  显示模块 元素小于60px时，点击热区都为60PX
                if(data.item_width < 60 && data.item_height < 60){
                    if(data.item_type == "2"){      //modify by fishYu 2016-8-27 14:13 修改过滤掉没有宽度的文字不设置 点击热点区域
                        if(data.item_width != 0){
                            this.transformElement.style.width = "60px";
                            this.transformElement.style.height = "60px";
                        }
                    }else{
                        this.transformElement.style.width = "60px";
                        this.transformElement.style.height = "60px";
                    }
                }

            }else if (itemHref && itemHref !="none" && itemType == 37 ){
                if(itemHref.indexOf("none|") < 0) {         //过滤"none|none"
                    //获取图集事件的集合
                    //TODO 处理图集事件的集合
                    //定义一个事件数组集合
                    this.photosSwipeEventsList = [];
                    this.parsePhotosSwipeEventHandle(itemHref);
                }
            }else{
                //add by fishYu 2016-4-8 20:04 "can-swipe", "yes" 表示可以翻页
                el.setAttribute("can-swipe", "yes");
            }

            //add by fishYu 2016-4-11 10:10 "data-type" 'me-viewport' 表示摘要浮层
            var abstractSetting = data.abstract_setting;
            if(abstractSetting == "1"){
                this.element.setAttribute("data-type", "me-viewport");
                //摘要页的浮层长页
                if(data.item_height > 1008){
                    $(this.element).addClass("pro-wrapper");
                    this.element.setAttribute("data-bar","cancel-scroll-bar");
                    //TODO 这个浮层必须在最上层
                    $(this.element).css({"overflowY":"auto"});
                    $(this.contentElement).css({"height": data.item_height+"px"});
                    this.element.onscroll = function(e){
                        //滚动到文字底部的时候
                        if(this.scrollTop == (this.scrollHeight - 1008)){
                            $(this).removeClass("pro-wrapper");
                        }else if(this.scrollTop == 0){
                            $(this).removeClass("pro-wrapper");
                        }
                    }
                }

            }
            /*设置输入框的样式*/
            var borderWidth = data.item_border; //边框宽度
            var borderRadius = data.bd_radius+"";  //边框圆角
            var borderColor = data.bd_color || "#000";  //边框颜色
            var borderSide = data.bd_side;   //哪边有值
            var borderStyle = data.bd_style || "solid";
            if(borderWidth){
                if(borderSide){
                    if(borderSide.indexOf("top") > -1){
                        el.style.borderTop = borderWidth + "px " +borderStyle +" " +borderColor;
                    }
                    if(borderSide.indexOf("right") > -1){
                        el.style.borderRight = borderWidth +  "px " +borderStyle +" "  + borderColor;
                    }
                    if(borderSide.indexOf("bottom") > -1){
                        el.style.borderBottom = borderWidth +  "px " +borderStyle +" "  + borderColor;
                    }
                    if(borderSide.indexOf("left") > -1){
                        el.style.borderLeft = borderWidth +  "px " +borderStyle +" "  + borderColor;
                    }
                }
            }else{
                el.style.border = "none";
            }
            if(borderRadius){
                if(borderRadius.indexOf("%") > -1){
                    el.style.borderRadius = borderRadius;
                }else{
                    if(borderRadius.indexOf("px") > -1){
                        el.style.borderRadius = borderRadius;
                    }else{
                        el.style.borderRadius = borderRadius + "px";
                    }
                }
            }
            //设置元素显示
            el.style.boxSizing = "border-box";

//
//
////        console.log("scale(" + scaleX + "," + scaleY + ") rotate(" + rotateAngle + "deg) !important");
//        style["-webkit-transform"] = "scale(" + scaleX + "," + scaleY + ") rotate(" + rotateAngle + "deg)";
//        style["transform"] = "scale(" + scaleX + "," + scaleY + ") rotate(" + rotateAngle + "deg)";
////        console.log("g");
//
            var animate = data.item_animation;
            var animateVal = data.item_animation_val;
//
//        if(this._animateClassObjects.length > 0){
//            dms.ParseAnimation(this._animateClassObjects[0],animate,animateVal);
//        }else{
            var cyanAS = this.userData.item_animation_script;
            //动画脚本
            if(cyanAS){
                dms.AnimationScriptParser.call(this,cyanAS);
            }else{
                //TODO 没设置文字宽高的时候设置动画的某些动画时候文字偏移
                dms.ParseAnimation(this,animate,animateVal);
            }

//        }


        }

        if(data.animate_end_act){
            this.animateEndAct = dms.AnimateEndActParser(data.animate_end_act);
        }

        //console.log("id",getSymbolId.call(this));
    };

    //item_animation_val
    //{
    //    autoPlay:true,
    //    loop_on_time:0,
    //    delay:0,
    //    infinite:'infinite',
    //    act_on_time:{
    //    '1.2':[
    //        {
    //            play_el:元素id,
    //            pause_el:元素id,
    //            show_el:元素id,
    //            hide_el:元素id,
    //            animate_el:元素id,
    //            stop_animate_el:元素id,
    //            animate_el:{id:元素id,from_time:1.2}
    //        }
    //    ],
    //        '2.5':[]
    //},
    //    act_count:{
    //        '1.2':1,
    //            '2.5':1
    //    }
    //}

    var p = RenderObject.prototype;

    var maxCount = 9999999;

    /**
     * 准备时间轴事件，动画
     * 解析相当参数，为播放时间轴作准备
     */
    p.readyToTimeline = function(){
        var script;

        //是否有时间轴脚本
        if(script = this._cyanAnimationScript){

            //console.log(this._cyanAnimationScript,this.uid);
            //时间轴参数，详见注释
            var animateVal = this.userData.item_animation_val;
            var timelineName = "timeline_" + this.uid;
            var stage = this.dmsStage;

            var compId = this.userObject.compPrefix + stage.page.pageIndex;
            var display = this.userObject.magazineDisplay;
            //console.log(compId);
            //console.log("compId",compId);
            //console.log("count",count);
            if(animateVal != "undefined" && animateVal){
                //var params = dms.toJSON(animateVal);

                var count = script.loop;
                //console.log("df");
                //console.log("count",count);
                if(count){

                    if(count != 'infinite'){
                        count = parseInt(count);
                    }else{
                        count = maxCount;
                    }
                    var aniIndex = 0;
                    Cyan.Symbol.bindTimelineAction(compId, "stage", timelineName, "complete", function(sym){
                        aniIndex++;
                        if(aniIndex < count){
                            sym.playTimeline(timelineName,script.loopOnTime);
                        }
                    });
                }

                var aot,time,v;


                if(aot = script.act_on_time){
                    //console.log("readyToTimeline",script);
                    //act_on_time里面的动画执行的次数
                    var ac = script.act_count || {};
                    for(var key in aot){
                        time = parseFloat(key)*1000;
                        v = aot[key];
                        var actCount = ac[key] || maxCount;
                        Cyan.Symbol.bindTriggerAction(compId,"stage",timelineName,time,(function(actCount,actScript){
                            var count = 0;
                            return function(sym){

                                count++;
                                if(count < actCount){

                                    if(actScript && actScript.length > 0){
                                        var obj;
                                        //console.log("sym2",actScript);
                                        for(var i = 0;i < actScript.length;i++){
                                            obj = actScript[i];
                                            for(var key2 in obj){
                                                //console.log("ac",obj);
                                                if(dms.ActList[key2]){
                                                    dms.ActList[key2].call(display,obj[key2]);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        })(actCount,v));
                    }
                }
            }
        }
    };

    var getSymbolId = function(){
        if(this._symbolId){
            return this._symbolId;
        }
        var parent = $(this.element).parent("div[data-type=stage]");
        //console.log(parent[0]);
        if(parent[0]){
            return (this._symbolId = parent[0].id);
        }
        return null;
    };

    var getSymbol = function(){
        var id = getSymbolId.call(this);
        if(id){
            var sym = Cyan.Symbol.get("#" + id);
            return sym;
            //console.log(sym);
        }
    };

    var getTimelineName = function(uid){
        return "timeline_" + uid;
    };

    p.resetPlayTimeline = function(){
        var script = this._cyanAnimationScript;
        //console.log(script);
        if(script){
            var self = this;
            if(script.autoPlay){
                if(script.delay){
                    setTimeout(function(){
                        self.playTimeline(0);
                    },script.delay);
                }else{
                    self.playTimeline(0);
                }
            }

        }
    };

    p.playTimeline = function(time){
        var sym = getSymbol.call(this);
        //console.log("oo");
        if(sym){

            var timelineName = getTimelineName(this.uid);
            //console.log(sym,timelineName,this);
            if(time !== undefined){
                sym.playTimeline(timelineName,time);
            }else{
                sym.playTimeline(timelineName);
            }
        }
    };

    p.stopTimeline = function(){
        var sym = getSymbol.call(this);
        if(sym){
            var timelineName = getTimelineName(this.uid);
            sym.stopTimeline(timelineName);
        }
    };

    p.pauseTimeline = function(){
        var sym = getSymbol.call(this);
        if(sym){
            var timelineName = getTimelineName(this.uid);
            sym.stopTimeline(timelineName);
        }
    };

    p.resetAnimation = function(){
        this._animationIndex = 0;
        this.playCSSAnimation();
    };

    p.playCSSAnimation = function(index){
        index = index === undefined ? this._animationIndex : index;
        this._animationIndex = index;
        var anims = this._animationNames;
        if(!anims){
            return;
        }
        if(index >= anims.length){
            return;
        }

        var vals  = this._animationVals;
        if(anims[index] && anims[index] != "undefined"){
            //dms.Css.addClass(this.contentElement,anims[index] + " animated");
            this.contentElement.className = anims[index] + " animated";
            if(!this._initAnimationEvent){
                this._initAnimationEvent = true;
                var self = this;
                $(this.contentElement).on("webkitAnimationEnd",function(){
                    self._animationIndex++;
                    self.playCSSAnimation(self._animationIndex);
                    self._initAnimationEvent = false;
                });
            }
        }

        var el = this.contentElement;
        var delay = 0.3;
        var style = el.style;
        //解析动画参数
        var params = {};
        if (anims[index]&& anims[index] != "undefined" && vals[index] ) {
            params = vals[index];
            //延迟时间
            if (params.delay) {
                delay = parseFloat(params.delay) + delay;
            }


            //动画持续时间
            if (params.duration) {
                style["WebkitAnimationDuration"] = params.duration + "s";
                style["animationDuration"] = params.duration + "s";
            }
            //动画次数
            style["WebkitAnimationIterationCount"] = 1;
            style["animationIterationCount"] = 1;
            if (params.infinite) {
                style["WebkitAnimationIterationCount"] = params.infinite;
                style["animationIterationCount"] = params.infinite;
            }
        }

        style["WebkitAnimationDelay"] = (delay) + "s";
        style["animationDelay"] = (delay) + "s";
        //modify by fishYu 2016-8-18 16:55 解决动画完了会移动的问题，但是没有设置type的情况会可能出现问题,例如app里面
        var type ;
        if(params.hasOwnProperty("type")){
            type = params.type;
        }
        if(type != "out"){
            style["WebkitAnimationFillMode"] = "backwards";
            style["animationFillMode"] = "backwards";
        }else{
            style["WebkitAnimationFillMode"] = "both";
            style["animationFillMode"] = "both";
        }
    };

    function execAct(arr){
        for(var i = 0;i < arr.length;i++){
            var o = arr[i];
            if(dms.ActList[o.type]){
                dms.ActList[o.type](o.param);
            }
        }
    }

    /**
     * 单击处理
     */
    p.tapHandle = function(e){
        var o;
        if((o = this.eventList['meTap'])){
            //modify by fishYu 2016-4-11 14:10预防点击元素事件的时候，外部事件还执行
            window.isHammerTap = true;
            e.srcEvent.stopPropagation();
            e.srcEvent.preventDefault();
            execAct(o);
        }else{
            window.isHammerTap = false;
        }
    };

    /**
     * 长按处理
     */
    p.holdHandle = function(e){
        var o;
        if((o = this.eventList['meLongTap'])){
            e.srcEvent.stopPropagation();
            e.srcEvent.preventDefault();
            execAct(o);
        }
        this.onHoldHandle();
    };
    p.onHoldHandle = function(){};

    p.swipeLeftHandle = function(e){
        //console.log('swipeleft');
        //e.srcEvent.preventDefault();
        //e.srcEvent.stopPropagation();
        //console.log(e);
        var o;
        if((o = this.eventList['meSwipeLeft'])){
            execAct(o);
            this.changeSwipeStatus(e.target);
        }
    };

    p.swipeRightHandle = function(e){
        var o;
        if((o = this.eventList['meSwipeRight'])){
            execAct(o);
            this.changeSwipeStatus(e.target);
        }
    };

    p.swipeUpHandle = function(e){
        var o;
        if((o = this.eventList['meSwipeUp'])){
            execAct(o);
            this.changeSwipeStatus(e.target);
        }
    };

    p.swipeDownHandle = function(e){
        var o;
        if((o = this.eventList['meSwipeDown'])){
            execAct(o);
            this.changeSwipeStatus(e.target);
        }
    };
    /**
     * 修改元素的可滑动的状态
     * @param target 当前点击事件的对象
     */
    p.changeSwipeStatus = function(target){
        var canSwipe = target.getAttribute("can-swipe");
        if(canSwipe == "no"){
            target.setAttribute("can-swipe", "yes");
        }else{
            target.setAttribute("can-swipe", "no");
        }
    };

    p.execAnimationEndAct = function(){
        if(this.animateEndAct){
            if(this.animateEndAct.actList && this.animateEndAct.actList.length > 0){
                execAct(this.animateEndAct.actList);
            }
        }
    };

    p.execAnimationEndActSuccess = function(){
        if(this.animateEndAct){
            if(this.animateEndAct.success && this.animateEndAct.success.length > 0){
                execAct(this.animateEndAct.success);
            }
        }
    }

    p.execAnimationEndActError = function(){
        if(this.animateEndAct){
            if(this.animateEndAct.error && this.animateEndAct.error.length > 0){
                var index = this.animateEndAct.errorCount;
                if(this.animateEndAct.error[index]){
                    execAct(this.animateEndAct.error[index]);
                    this.animateEndAct.errorCount++;
                }

            }
        }
    }
    /**
     * 处理图集事件的集合
     * @param itemHref
     */
    p.parsePhotosSwipeEventHandle = function(itemHref){
        var self = this;
        var itemHrefHandleArr = itemHref.split("@");
        var len = itemHrefHandleArr.length;
        var temp;
        for(var i = 0; i < len; i++){
            temp = itemHrefHandleArr[i];
            if(temp == ""){
                self.photosSwipeEventsList.push(null);
            }else{
                self.photosSwipeEventsList.push(dms.EventParser(temp));
            }
        }
    }
})(dms);

var ROSetItemId = function(item, scriptParser){
    //console.log(this);
    if(item.data_for){
        this.userProperties = scriptParser.getObject(item.data_for);
    }
    this.uid = (item.item_id || dms.getNewID()) + "";

    this.contentElement.id = "cyan_" + this.uid;
    //this.contentElement.setAttribute("data-id",this.uid);
    dms.ObjectManager.setObj("cyan_" + this.uid,this);
};