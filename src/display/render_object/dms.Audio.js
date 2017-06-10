// 文件名称: Audio
//
// 创 建 人: fishYu
// 创建日期: 2015/9/25 13:30
// 描    述: 音频
dms.Audio = function(){
    var self = this;
    this._playAudio = document.createElement("audio");
    this._playAudioButtonAnimation = document.createElement("div");
    dms.RenderObject.call(this);
    this.contentElement.appendChild(this._playAudio);
    //modify by fishYu 2016-3-3 13：30增加音频的按钮播放动画
    this.contentElement.appendChild(this._playAudioButtonAnimation);
    this.addListener();
};


dms.inherit(dms.Audio,dms.RenderObject);

dms.Audio.prototype.pauseAudio = function(){
    this._playAudio.setAttribute("play-status", "play-normal");
    this._playAudio.pause();
    this.contentElement.style.background =  'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAMAAADOixOHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABGlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAACz+Fa2AAAAXHRSTlMAhHeK/mmR+jxx5RSHnwO2OwYW674Hs6QBXjkKuHUC05z4JVryCEb8qO1CgP0dg+R0X359MdlKEfDJDn/P+1ISeD3d2qlkF2Kmha4QDESBCekNBNxNbMXAP5ahFZTSyTUAAAABYktHRACIBR1IAAAACXBIWXMAAAsSAAALEgHS3X78AAABLklEQVQoz22S11bDMBAFBYgaIISShBaaTTMh9G7A9FBC7/v/38G9CvKxj6wHa3ZWWq8lK5UeLa0qa7SJbs/QHSLS2eX6bnjpybmJXib6XN+fh9cDSVUo8Dk4hMRwQo8US2XOo6w0FuvxCZFJQmUKfjr2rDszS5oDeb718wsIF0n+Emg53hAgWqmSSqDV2Ps1hGukdUAR80bzqDYR5glbgG1o0Ts2rBF2AXtm2T7DAzZudvKT1SGeRyYMQeyvYjwS+pg6hzAknJg6SJya5RHCM/ui8/SdXBAu//tsjisP4TXpBlC3unzLY7kD3XPBg/UNdtmwZbzH5PE8PQNeXtM3GYh+4/zOjVHiwgLTbpXVP9x7/+THfjn+m1V+HF03/9Wv49lVGCmVlcj6b21XSv0Br5lN9OvlDGIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDEtMjBUMTQ6NDE6NTcrMDg6MDBBCJ6JAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTAxLTIwVDE0OjQxOjU3KzA4OjAwMFUmNQAAAABJRU5ErkJggg==") no-repeat center rgba(0,0,0,.5)';
    //暂停的时候显示动画层
//    this._playAudioButtonAnimation.style.display = "block";
    this.resetButtonAnimation();
};

dms.Audio.prototype.playAudio = function() {
    //打开当前的音频
    this.changePlayStatus();
    this._playAudio.play();

};

dms.Audio.prototype.changePlayStatus = function(){
    var contentWrapper = this.stage || this.parent.stage;
    if( contentWrapper[0]&&contentWrapper[0].querySelector("*[play-status='play-current']")){
        contentWrapper[0].querySelector("*[play-status='play-current']").setAttribute("play-status", "play-normal");
    }
    this._playAudio.setAttribute("play-status", "play-current");
    //播放的时候隐藏动画层
    this._playAudioButtonAnimation.style.WebkitAnimation = "none";
//    this._playAudioButtonAnimation.style.display = "none";
    //派发自己正在播放的事件
    var event = dms.createEvent(dms.OTHER_AUDIO_PLAY, "");
    dms.dispatcher.dispatchEvent(event);
    this.contentElement.style.background ='url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAaAgMAAADK7ZTuAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAACVBMVEUAAAD///8AAABzxoNxAAAAAXRSTlMAQObYZgAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAARSURBVAjXYwhlYGAIZRiUJABDnxFF8v/L5gAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxNi0wMS0yMFQxNDo0MTo0NCswODowMLxKhIoAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTYtMDEtMjBUMTQ6NDE6NDQrMDg6MDDNFzw2AAAAAElFTkSuQmCC") no-repeat center rgba(0,0,0,.5) ';

};

dms.Audio.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
//    dms.dispatcher.off(dms.MANI_AUDIO_PLAY);
    dms.dispatcher.removeAllEventListeners(dms.SWIPE_TOUCH_END);
    dms.dispatcher.removeAllEventListeners(dms.VIDEO_PLAY);
};

dms.Audio.prototype.addListener = function(){
    var self = this;
    this.onClick = function(e){
        e.stopPropagation();
        e.preventDefault();
        if(self._playAudio.getAttribute("play-status") == "play-normal"){
            self.playAudio();
        }else{
            self.pauseAudio();
            //派发自己正在播放的事件
            var event = dms.createEvent(dms.OTHER_AUDIO_END, "");
            dms.dispatcher.dispatchEvent(event);
        }
    };
    //音频播放完，不设置重复播放，
    this._playAudio.onended = function(){
        self.pauseAudio();
        //派发自己正在播放的事件
        var event = dms.createEvent(dms.OTHER_AUDIO_END, "");
        dms.dispatcher.dispatchEvent(event);
    };
    this._playAudio.addEventListener("ended", function(){
        self.pauseAudio();
        if(self.endScript){  //成功执行的脚本
//            dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",self.endScript));
            self.execAnimationEndAct();
        }
    });

    //监听滑动页的事件
    dms.dispatcher.on(dms.SWIPE_TOUCH_END, function(e){
        e.stopPropagation();
        e.preventDefault();
        if(self.pauseAudio){
            self.pauseAudio();
        }
    });
    // 视频播放的时候
    dms.dispatcher.on(dms.VIDEO_PLAY, function(e){
        e.stopPropagation();
        e.preventDefault();
        if(!e.target){
            if(self.pauseAudio){
                self.pauseAudio();
            }
        }
    });
}
/**
 * 重新设置动画元素的动画效果
 */
dms.Audio.prototype.resetButtonAnimation = function (){
    var playAudioAnimateStyle = this._playAudioButtonAnimation.style;
    playAudioAnimateStyle.WebkitAnimationName = "player-button";
    playAudioAnimateStyle.WebkitAnimationDuration = "2.6s";
    playAudioAnimateStyle.WebkitAnimationIterationCount = "infinite";
    playAudioAnimateStyle.WebkitAnimationTimingFunction = "linear";
};