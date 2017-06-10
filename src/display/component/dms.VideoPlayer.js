// 文件名称: VideoPlayer
//
// 创 建 人: fishYu
// 创建日期: 2015/8/4 16:22
// 描    述: 视频播放器
// 文件名称: VideoPlayer
(function(dms){
    /**
     *
     * @param container 插入播放器的容器 DOM对象
     * @param data   视频对象的数据
     *@param backgroundSize   背景图片的颜色
     *@param parentView   对应的父控件
     * @constructor
     */
    var VideoPlayer = function(container,data, backgroundSize, parentView){
        this.__container = container;
        var self = this;
        this.startPlay = true;      //第一次点击的时候播放视频
        self.clickEventName = dms.getEventName();
        self.parentView = parentView;
        var videoSrc = data.item_href;
        //整个视频浮层
        if(!this._videoDiv){
            this._videoDiv = document.createElement("div");
        }
        var videoDivStyle = this._videoDiv.style;
        videoDivStyle.position = "absolute";
        videoDivStyle.zIndex = "1000000";
        videoDivStyle.width = "100%";
        videoDivStyle.height = "100%";
        //视频播放器
        if(!this._video){
            this._video = document.createElement("video");
        }
        var itemWidth = data.item_width;
        var itemHeight = data.item_height;
        this._video.width = data.item_width;
        this._video.height = data.item_height;    //自适应宽度
        this._video.setAttribute("id" , 'vjs_video_1');
        this._video.preload = "auto";
        this._video.controls = "controls";
//        this._video.autoplay="autoplay";
        this._video.setAttribute("x-webkit-airplay", "true");
        this._video.setAttribute("webkit-playsinline", "true");
        var itemVal = data.item_val;
        if(itemVal) {
            //modify by fishYu 2016-4-22 18:44 修改让视频的背景图片适配视频的区域
            var posterVal = itemVal.split("?")[0]+"?imageView2/1/w/"+parseInt(itemWidth)+"/h/" +parseInt(itemHeight);
            this._video.poster = posterVal;
            this._video.setAttribute("poster", posterVal);
            this._video.setAttribute("autobuffer","Autobuffer");
        }
        this.endScript = data.animate_end_act;
        var videoStyle = this._video.style;
        videoStyle.position = "absolute";
        videoStyle.zIndex = "1";

        //视频内容
        var videoSource = document.createElement("source");
        videoSource.src = videoSrc;
        videoSource.type = "video/mp4";
        //透明的开关按钮DIV
        var playPauseDiv =  document.createElement("div");
        playPauseDiv.setAttribute("id", "playPauseDiv");
        var playPauseDivStyle = playPauseDiv.style;
        playPauseDivStyle.position = "absolute";
        playPauseDivStyle.zIndex = "2";
        playPauseDivStyle.width = "70px";
        playPauseDivStyle.height = "70px";
        playPauseDivStyle.left = "0";
        playPauseDivStyle.bottom = "0";

        var fullScreenDiv =  document.createElement("div");
        fullScreenDiv.setAttribute("id", "fullScreenDiv");
        var fullScreenDivStyle = fullScreenDiv.style;
        fullScreenDivStyle.position = "absolute";
        fullScreenDivStyle.zIndex = "2";
        fullScreenDivStyle.width = "70px";
        fullScreenDivStyle.height = "70px";
        fullScreenDivStyle.right = "0";
        fullScreenDivStyle.bottom = "0";
//        playPauseDivStyle.pointerEvents = "none";

        this._video.appendChild(videoSource);
        this._videoDiv.appendChild(this._video);
        this._videoDiv.appendChild(playPauseDiv);
        this._videoDiv.appendChild(fullScreenDiv);


        //暂停浮层
        this.pauseDiv = document.createElement("div");
        var pauseDivStyle = this.pauseDiv.style;
        pauseDivStyle.position = "absolute";
        pauseDivStyle.display = "none";
        pauseDivStyle.zIndex = "1000003";
        pauseDivStyle.width = "100%";
        pauseDivStyle.height = "100%";
        if(itemVal){
            pauseDivStyle.backgroundImage = 'url("'+itemVal+'")';
            pauseDivStyle.backgroundPosition = "center";
            pauseDivStyle.backgroundSize = backgroundSize;
            pauseDivStyle.backgroundRepeat = "no-repeat";
        }
        //暂停的按钮div
        var __replayBtnDiv = document.createElement("div");
        var replayBtnDivStyle = __replayBtnDiv.style;
        replayBtnDivStyle.position = "relative";
        replayBtnDivStyle.zIndex = "1";
        replayBtnDivStyle.width = "100%";
        replayBtnDivStyle.top = "0";
        replayBtnDivStyle.left = "0";
        replayBtnDivStyle.height = "100%";
        replayBtnDivStyle.background = "rgba(0,0,0,.65)";

        //暂停的按钮
        var __replayBtn = document.createElement("div");
        __replayBtn.setAttribute("id", "replayBtn");
        var __replayBtnStyle = __replayBtn.style;
        __replayBtnStyle.position = "absolute";
        __replayBtnStyle.zIndex = "3";
        __replayBtnStyle.width = "88px";
        __replayBtnStyle.height = "88px";
        __replayBtnStyle.top = "50%";
        __replayBtnStyle.left = "50%";
        __replayBtnStyle.transform = "translate(-50%, -50%)";
        __replayBtnStyle.transform = "-webkit-translate(-50%, -50%)";
        //modify by fishYu 2016-3-3 13：30修改视频播放按钮图标
        __replayBtnStyle.background ="url('data:image/png;base64,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') center no-repeat";
        __replayBtnStyle.backgroundSize = "cover";
        __replayBtnDiv.appendChild(__replayBtn);
        this.pauseDiv.appendChild(__replayBtnDiv);

        //结束浮层
        this.endDiv = document.createElement("div");
        var endDivStyle = this.endDiv.style;
        endDivStyle.position = "absolute";
        endDivStyle.display = "none";
        endDivStyle.zIndex = "1000005";
        endDivStyle.width = "100%";
        endDivStyle.height = "100%";
        if(itemVal){
            endDivStyle.backgroundImage = 'url("'+itemVal+'")';
            endDivStyle.backgroundPosition = "center";
            endDivStyle.backgroundSize = backgroundSize;
            endDivStyle.backgroundRepeat = "no-repeat";
        }
        //结束按钮提示背景图层
        this.endBtnDiv = document.createElement("div");
        var endBtnDivStyle = this.endBtnDiv.style;
        endBtnDivStyle.position = "relative";
        endBtnDivStyle.zIndex = "1";
        endBtnDivStyle.width = "100%";
        endBtnDivStyle.top = "0";
        endBtnDivStyle.left = "0";
        endBtnDivStyle.height = "100%";
        endBtnDivStyle.background = "rgba(0,0,0,.65)";

        //结束按钮提示
        var endBtn = document.createElement("span");
        endBtn.innerHTML = "重新开始";
        endBtn.setAttribute("id", "endSpan");
        var endBtnStyle = endBtn.style;
        endBtnStyle.position = "absolute";
        endBtnStyle.zIndex = "3";
        endBtnStyle.display = "inline-block";
        endBtnStyle.padding = "0 20px";
        endBtnStyle.top = "50%";
        endBtnStyle.left = "50%";
        endBtnStyle.transform = "translate(-50% ,-50%)";
        endBtnStyle.transform = "-webkit-translate(-50% ,-50%)";
        endBtnStyle.height = "70px";
        endBtnStyle.fontSize = "30px";
        endBtnStyle.textAlign = "center";
        endBtnStyle.borderRadius = "20px";
        endBtnStyle.background = "#1b1b1b";
        endBtnStyle.lineHeight = "70px";
        endBtnStyle.color = "#fff";
        endBtnStyle.letterSpacing = "5px";
        this.endBtnDiv.appendChild(endBtn);
        this.endDiv.appendChild(this.endBtnDiv);

        this.__container.appendChild(this._videoDiv);
        this.__container.appendChild(this.pauseDiv);
        //为了支持4S能点击二次播放
        this.__container.appendChild(this.endDiv);
        //添加事件
        self.addListener();
    };

    VideoPlayer.prototype.play = function(){
        var self = this;
        $(this.pauseDiv).hide();
        $(this.endDiv).hide();
        //重新设置视频状态
        var contentWrapper = self.parentView.stage || self.parentView.parent.stage;
        if( contentWrapper[0]&&contentWrapper[0].querySelector("*[play-video-status='play-current']")){
            contentWrapper[0].querySelector("*[play-video-status='play-current']").setAttribute("play-video-status", "play-normal");
        }
        this._video.setAttribute("play-video-status", "play-current");
        this._video.play();
//        console.log(self._video.videoHeight, self._video.videoWidth);
        //TODO 这里会有个冲突，视频播放，音乐播放，语音播放
        //视频播放
        var event = dms.createEvent(dms.VIDEO_PLAY, "");
        dms.dispatcher.dispatchEvent(event);
    };

    VideoPlayer.prototype.pause = function(){
        if(!this._video.paused){
            this.pauseDiv.style.display = "block";
            this._video.setAttribute("play-video-status", "play-normal");
            this._video.pause();
        }
    };
    /**
     * 增加一个事件绑定总入口
     */
    VideoPlayer.prototype.addListener = function(){
        var self = this;
        //透明播放暂停的按钮
        $(self.__container).find("#playPauseDiv").on(self.clickEventName, function(e){
            e.preventDefault();
            e.stopPropagation();
            if(self._video.paused){
                self.play();
            }else{
                self.pause();
            }
        });
        //透明全屏的按钮
        $(self.__container).find("#fullScreenDiv").on(self.clickEventName, function(e){
            e.preventDefault();
            e.stopPropagation();
            if(self._video.requestFullscreen) {
                self._video.requestFullscreen();
            } else if(self._video.mozRequestFullScreen) {
                self._video.mozRequestFullScreen();
            } else if(self._video.webkitRequestFullscreen) {
                self._video.webkitRequestFullscreen();
            } else if(self._video.msRequestFullscreen) {
                self._video.msRequestFullscreen();
            }
        });
        //点击播放
        $(self.__container).find("#replayBtn").on(self.clickEventName, function(e){
            e.stopPropagation();
            e.preventDefault();
            self.play();
        });
        //点击重新开始
        $(self.endBtnDiv).on(self.clickEventName, function(e){
            e.stopPropagation();
            e.preventDefault();
            self.play();
        });
        //点击重新开始
        self.endBtnDiv.addEventListener(self.clickEventName, function(e){
            e.stopPropagation();
            e.preventDefault();
            self.play();
        });
        //点击重新开始
        self.endDiv.addEventListener(self.clickEventName, function(e){
            e.stopPropagation();
            e.preventDefault();
            self.play();
        });
        //视频播放结束事件
        this._video.addEventListener("ended", function(e){
            //为了支持4S能点击二次播放
            self.endDiv.style.display = "block";
            //视频播放结束
            var event = dms.createEvent(dms.OTHER_AUDIO_END, "");
            dms.dispatcher.dispatchEvent(event);
            //有脚本的话直接执行脚本
            if(self.endScript){
                self.parentView.execAnimationEndAct();
            }
        });
        //视频数据初始化事件
        this._video.addEventListener("loadedmetadata", function(e){
//            self.play();
        });
        $(this._video).on(self.clickEventName, function(e){
            e.stopPropagation();
            e.preventDefault();
            if(self.startPlay){
                self.play();
                self.startPlay = false;
            }
        });
        //视频数据初始化事件
        this._video.addEventListener("loadstart", function(e){
//            self.play();
        });
        this._video.addEventListener("play", function(e){
//            debug.log("本身自己按钮的点击播放开始了");
            //派发停止音乐播放的事件
            //视频播放
            var event = dms.createEvent(dms.VIDEO_PLAY, "");
            dms.dispatcher.dispatchEvent(event);
        }, false);
        this._video.addEventListener("pause", function(e){
            self.pauseDiv.style.display = "block";
            self._video.setAttribute("play-video-status", "play-normal");
        });
        //监听主音乐播放
        dms.dispatcher.on(dms.MANI_AUDIO_PLAY, this.pause.bind(this));
        //其他音乐播放的情况（当前页有视频和音频的情况）
        dms.dispatcher.on(dms.OTHER_AUDIO_PLAY, this.pause.bind(this));
        //滑动页的时候暂停视频
        dms.dispatcher.on(dms.SWIPE_TOUCH_END, this.pause.bind(this));
    };
    VideoPlayer.prototype.destroy = function(){
        if(this._videoDiv){
            if(this._video){
                this._video.pause();
                this._video.src = "";
                this._videoDiv.removeChild(this._video);
            }
            this.__container.removeChild(this._videoDiv);
            this.__container.removeChild(this.pauseDiv);
            this.__container.removeChild(this.endDiv);
            this._videoDiv = null;
            dms.dispatcher.removeAllEventListeners(dms.MANI_AUDIO_PLAY);
            dms.dispatcher.removeAllEventListeners(dms.OTHER_AUDIO_PLAY);
            dms.dispatcher.removeAllEventListeners(dms.SWIPE_TOUCH_END);
        }
    };
    dms.VideoPlayer = VideoPlayer;
})(dms);