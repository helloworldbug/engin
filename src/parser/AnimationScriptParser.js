// 文件名称: AnimationScriptParser
//
// 创 建 人: chenshy
// 创建日期: 2015/12/11 14:40
// 描    述: AnimationScriptParser
(function(dms){

    dms.AnimationScriptParser = function(animationScript){
        var userData = this.userData;
        var cyanAS = userData.item_animation_script;

        //console.log(cyanAS,"item_animation_script");
        var timelines = {};
        var animateVal = userData.item_animation_val;

        var param = {
            autoplay : true,
            loop : 0,
            delay : 0
        };
        if(animateVal != "undefined" && animateVal){
            var params = dms.toJSON(animateVal);
            params.loop = params.loop || params.infinite;
            //console.log("params.infinite",params.loop);
            param.autoPlay = params.autoplay === undefined ? true : !!params.autoplay;
            param.loop = params.loop === undefined ? 0 : params.loop;
            param.loopOnTime = params.loop_on_time === undefined ? 0 : params.loop_on_time;
            param.delay = params.delay || 0;
            timelines.act_on_time = params.act_on_time;
        }

        timelines.autoPlay = param.autoPlay === undefined ? true : !!param.autoPlay;
        timelines.timeline = [];
        timelines.loop = param.loop;
        timelines.loopOnTime = param.loopOnTime * 1000;
        timelines.delay = param.delay * 1000;

        var json = "[" + cyanAS + "]";
        //console.log(json);
        //json =
        //try{
            json = dms.toJSON(json);

            timelines.timeline = json;

            //if(param.delay){
            //    timelines.loopOnTime += param.delay * 1000;
            //}

            var data,tw;

            var motions = [], i,rotateZs = [];

        var st = function(a, b) {
            return a.position - b.position
        };

        //if(param.delay){
        //    json.sort(st);
        //    data = json[0];
        //    var position = data.position;
        //    var newDatas = [],newData;
        //    for(i = 0;i < json.length;i++){
        //        data = json[i];
        //        if(data.position == position){
        //            newData = dms.cloneJSONObject(data);
        //
        //            newDatas.push(newData);
        //        }
        //    }
        //}

            for(i = 0; i < json.length; i++){
                data = json[i];
                tw = data.tween;
                tw[1] = "${_cyan_" + this.uid + "}";
                //if(param.delay){
                //    //console.log("tw",tw)
                //    data.position = data.position + (param.delay * 1000);
                //}

                //if(tw[0] == 'motion'){
                //    motions.push(data);
                //}
                //
                //if(tw[2] == 'rotateZ'){
                //    rotateZs.push(data);
                //}
            }





        //console.log(rotateZs);

            //console.log(json);
            //console.log("this",this,json);
            this._cyanAnimationScript = timelines;
        //console.log("timelines",timelines);
        //}catch(e){}
    };

    function getAnimationParam(param){
        var uid,item_animation,delay = 0,duration = 1,infinite = 1;
        var animationParam = "{}";
        if(dms.isObject(param)){
            uid = param.id;
            item_animation = param.item_animation;
            delay = param.delay;
            duration = param.duration;
            infinite = param.infinite;
            animationParam = JSON.stringify(param);
        }else{
            uid = param;
        }

        return {
            id: uid,
            ia: item_animation,
            ap: animationParam
        };
    }

    dms.ActList = {
        //播放音视频元素
        'play_el': function(param){
            var displayObject = dms.ObjectManager.getObj(param);
            if(displayObject){
                var itemType = displayObject.userData.item_type;
                displayObject.playAudio && displayObject.playAudio();
                if(itemType == 8 ){
                    displayObject._showVideoContent && displayObject._showVideoContent();
                    displayObject._videoPlayer && displayObject._videoPlayer.play&& displayObject._videoPlayer.play();
                }
            }
        },
        //暂停音视频元素
        'pause_el': function(param){
            var displayObject = dms.ObjectManager.getObj(param);
            if(displayObject){
                var itemType = displayObject.userData.item_type;
                displayObject.pauseAudio && displayObject.pauseAudio();
                if(itemType == 8){
                    displayObject._videoPlayer && displayObject._videoPlayer.pause&& displayObject._videoPlayer.pause();
                }
            }
        },
        //显示元素
        'show_el': function(param){
            param = getAnimationParam(param);
            var displayObject = dms.ObjectManager.getObj(param.id);
            if (displayObject) {
                dms.ParseAnimation(displayObject,param.ia,param.ap);
                displayObject.element.style.display = "";
                if (displayObject.onShow) { displayObject.onShow();}
            }
        },
        //隐藏元素
        'hide_el': function(param){
            param = getAnimationParam(param);
            var displayObject = dms.ObjectManager.getObj(param.id);
            if(displayObject){
                dms.ParseAnimation(displayObject, param.ia, param.ap);
                if (param.ia) {
                    var $el = $(displayObject.contentElement);
                    $el.on("webkitAnimationEnd", (function ($el, displayObject) {
                        return function () {
                            $el.off("webkitAnimationEnd");
                            displayObject.element.style.display = "none";
                        };
                    })($el, displayObject));
                } else {
                    displayObject.element.style.display = "none";
                }
            }
        },
        'open_link': function(param){
            //modify by fishYu 2016-4-11 15:23 修改打开链接的方式，兼容app和web以及内部或者外部打开链接
            var full_url = param.url;
            var openLinkWay = param.target;
            full_url = full_url.replace("&amp;", "&");  //预防& 更换为&amp;
            //区分开到底是APP里面打开还是APP外面打开
            var appVersion = "";
            if(window.app && window.app.VERSION){
                appVersion = window.app.VERSION;
            }
            if(appVersion) { //在App内部
                //作品链接的时候
                if (full_url.indexOf("tid=") > -1) {
                    //直接以内部链接形式打开,
                    var ref = window.open(full_url, '_blank');	//内部浏览器打开
                    //跳转链接之后派发关闭主音乐
                    var event = dms.createEvent(dms.OTHER_AUDIO_PLAY, "");
                    dms.dispatcher.dispatchEvent(event);
                    if (ref) {
                        ref.addEventListener('exit', function (e) {
                            //关闭链接之后派发打开主音乐
                            var event = dms.createEvent(dms.OTHER_AUDIO_END, "");
                            dms.dispatcher.dispatchEvent(event);
                            ref = null;
                        });
                    }
                } else {  //其他链接直接以内部链接打开
                    //下载链接
                    if (full_url.indexOf("http://me.agoodme.com") > -1) {
                        if ((/android/gi).test(navigator.appVersion)) {
                            window.open("http://a.app.qq.com/o/simple.jsp?pkgname=com.gli.cn.me", '_blank');	//内部浏览器打开
                        } else if ((/iphone|ipad/gi).test(navigator.appVersion)) {
                            window.open("https://itunes.apple.com/cn/app/mobigage-ndi/id917062901");	//外部浏览器打开itunes
                        }
                    } else {
                        window.open(full_url, '_blank');	//内部浏览器打开
                    }
                }
            }else{  //在APP 外部
                //获取userAgent用于判断是否微信
                if(openLinkWay != "_blank"){
                    var userAgent = navigator.userAgent.toLowerCase();
                    if (userAgent.indexOf("micromessenger") > -1){	//判断是否在微信里面
                        window.location.href = full_url;
                    }else if(userAgent.indexOf("qq/") > -1){ //在QQ浏览器里面的时候，为了不能跳转
                        window.location.href = full_url;
                    }else{
//                        window.open(full_url, '_blank');	//内部浏览器打开
                        window.location.href = full_url;
                    }
                }else {
                    //TODO  下面为内部打开链接
                    var event = dms.createEvent("open:inner:link", '');
                    event.data = full_url;
                    dms.dispatcher.dispatchEvent(event);
                }
            }
        },
        //跳转页
        'pageto': function(param){
            var event = dms.createEvent("pageto", '');
            event.data = param;
            dms.dispatcher.dispatchEvent(event);
        },
        //保存表单数据
        'submit': function(param){
            var event = dms.createEvent("submit", '');
            event.data = param;
            dms.dispatcher.dispatchEvent(event);
        },
        //拨打电话
        'telto': function(param){
            window.open("tel:" + param);
        },
        //播放timeline动画
        "animate_el" : function(param){
//            var elId;
//            //console.log("animate");
//            var fromTime = 0;
//
//            if(dms.isObject(param)){
//                elId = param.id;
//                if(param.from_time){
//                    fromTime = param.from_time;
//                }
//            }else {
//                elId = param;
//            }
//
//            //console.log("elId",param,elId);
//            if(elId){
//                var displayObject = this.getDisplayObjectByUID(elId);
//                //console.log(displayObject);
//                if(displayObject){
//                    displayObject.playTimeline(fromTime);
//                }
//            }
            for(var i = 0; i < param.length; i++) {
                var obj = param[i];
                var elId = obj.id;
                if (elId) {
                    var displayObject = dms.ObjectManager.getObj(elId);
                    if (displayObject) {
                        var contentEle = displayObject.contentElement;
                        contentEle.className = "";
                        var style = contentEle.style;
                        var animateName = obj.name;
                        contentEle.className = animateName + " animated";
                        //modify by fishYu 2016-4-29 11:22增加播放动画的类型
                        var type = obj.type || "in";
                        //动画持续时间
                        if (obj.duration) {
                            style["WebkitAnimationDuration"] = obj.duration + "s";
                            style["animationDuration"] = obj.duration + "s";
                        }
                        //动画次数
                        if (obj.infinite) {
                            style["WebkitAnimationIterationCount"] = obj.infinite;
                            style["animationIterationCount"] = obj.infinite;
                        } else {
                            style["WebkitAnimationIterationCount"] = 1;
                            style["animationIterationCount"] = 1;
                        }
                        //延迟时间
                        if (obj.delay) {
                            style["WebkitAnimationDelay"] = obj.delay + "s";
                            style["animationDelay"] = obj.delay + "s";
                        }else{
                            style["WebkitAnimationDelay"] = "0.3s";
                            style["animationDelay"] =  "0.3s";
                        }
                        $(contentEle).on("webkitAnimationEnd",function(){
                            $(this).off("webkitAnimationEnd");
                            if(type != "out"){
                                this.className = "";
                            } else {    //modify by fishYu 2016-9-6 14:14由于处理之前动画抖动，改变了下面属性，在退出的时候，属性需要设置both
                                this.style.WebkitAnimationFillMode = "both";
                                this.style.animationFillMode = "both";
                            }
                        });

                    }
                }
            }
        },
        //停止timeline动画
        "stop_animate_el" : function(param){
            var elId = param;
            if(elId){
                var displayObject = this.getDisplayObjectByUID(elId);
                //console.log(displayObject);
                if(displayObject){
                    displayObject.stopTimeline();
                }
            }
        },
        //移动元素
        "move_el" : function(param){
            for(var i = 0; i < param.length; i++) {
                var paramObj = param[i];
                var elId = paramObj.id;
                var displayObject = dms.ObjectManager.getObj(elId);
                if (displayObject) {
                    var $element = $(displayObject.element);
                    var $cElement = $(displayObject.contentElement);
                    $element.attr("data-change", 'true');
                    var left = parseInt($element.css("left"));
                    var top = parseInt($element.css("top"));
                    var toX = paramObj.to.x;
                    var toY = paramObj.to.y;
                    var obj = {};
                    //add by fishYu 20164-12 9:29增加
                    var position = paramObj.position;
                    if (position == "relative") {
                        //有可能是0， 负数，正数
                        toX = parseFloat(toX) + left;
                        obj.left = toX;

                        toY = parseFloat(toY) + top;
                        obj.top = toY;
                    } else if (position == "absolute") {
                        //有可能是0， 负数，正数
                        obj.left = parseFloat(toX);
                        obj.top = parseFloat(toY);
                    }
                    var speed = paramObj.speed || 0.5;
                    var self = this;
                    var ease = paramObj.easing || "linear";
                    speed = speed * 1000;
                    var delay = paramObj.delay || 0;
                    delay = delay * 1000;
                    $element.stop(true, true).delay(delay).animate(obj, {
                        duration: speed,
                        easing: ease,
                        complete : function(){
                            if (paramObj.end_act) {
                                var arr = paramObj.end_act;
                                for (var i = 0; i < arr.length; i++) {
                                    var o = arr[i];
                                    for (var key in o) {
                                        dms.ActList[key].call(self, o[key]);
                                    }
                                }
                            }
                        },
                        step : function(param){
//                            console.log('56666', param);
                        }
                    });
                }
            }
        },

        "move_screen" : function(param){
            //移动到指定的坐标
            var pos = param.pos;
            var frameWidth = this.frameSize[0];
            var frameHeight = this.frameSize[1];
            if(!pos){
                var elId = param.el;
                if(elId){
                    var displayObject = this.getDisplayObjectByUID(elId);
                    if(displayObject){
                        var left = parseInt(displayObject.element.style.left);
                        var top  = parseInt(displayObject.element.style.top);
                        //console.log("left top",left,top);
                        pos = {
                            x : frameWidth / 2 - left,
                            y : frameHeight / 2 - top
                        };
                        //console.log("pos.x,pos.y",pos.x,pos.y);
                    }
                }
            }

            if(pos){
                var stage = 0;
                var index = this.currentPage;
                stage = this.$wrapper.find("div[data-type='stage']").eq(index);
                var speed = param.speed || 500;
                var ease = "linear";

                var x = parseInt(stage.css("x"));
                var y = parseInt(stage.css("y"));

                pos.x = pos.x ? (x + pos.x) : x;
                pos.y = pos.y ? (y + pos.y) : y;
                //console.log(pos);

                if(pos.x <= 0 || pos.x > pos.x + frameWidth){
                    delete pos.x;
                }

                if(pos.y <= 0 || pos.y > pos.y + frameHeight){
                    delete pos.y;
                }

                if(!pos.x && !pos.y){
                    return;
                }

                if(stage[0].moving){
                    return;
                }

                stage[0].moving = true;

                stage.stop(true).transition(pos,speed,ease,function(){
                    stage[0].moving = false;
                    //console.log("pooo");
                });
            }
        }
    };

})(dms);