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
     * @param blurLayer 播放器下层模糊的DOM对象
     * @param content   播放器播放的内容嵌入的iframe
     * @constructor
     */
    var IframeVideoPlayer = function(container, blurLayer, content){
        if(container.parentNode){
            container = container.parentNode;
        }
        var tapName = dms.getEventName();
        this.__container = container;
        this.__blurLayer = blurLayer;
        this.__blurLayer.style.WebkitFilter = "blur(7px)";
        content = content.replace("width=", "width='100%'  ").replace("width:", "width:100%; ").replace(/&lt;/g, "<").replace(/&gt;/g, ">");  //手动把整个视频宽度设置为100%
        var self = this;
        //整个视频浮层
        if(!this._supernatant){
            this._supernatant = document.createElement("div");
        }
        this._supernatant.className = "half-zoom";
        var style = this._supernatant.style;
        style.position = "absolute";
        style.zIndex = "100000";
        style.left = "0";
        style.top = "0";
        style.width = "100%";
        style.height = "100%";
        style.backgroundColor = "rgba(0,0,0,.65)";
        //关闭按钮
        var close = document.createElement("div");
        var closeStyle = close.style;
        closeStyle.position = "absolute";
        closeStyle.left = "34px";
        closeStyle.top = "34px";
        closeStyle.width = "58px";
        closeStyle.height = "58px";
        closeStyle.background = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAV1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7u7uRkZHs7OycnJwAAADxN0xuAAAAHHRSTlMABidFWm9+hIoKOmqHG1sXYUoYdTOGQ0zQvPDAdFT41AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAFLSURBVEjHpZfZmoMgDIXB9VSpdevq+7/nWNvOFCcsenInX34hIYGDUpLpJM3yogTKIs/SRKtIO1S1gWWmrg4R4LFZcW+6OQbAUwuntScPqDsDj5nOGXQ/IGBDL5PjOUQC51EiL2HwaZf/5DWOBK475xTmHeNJwIq3j8jQV66+8qyDu2Lb8Le/3TYS6H6rz2xFzacm263kXM/vXrEGb3fZ+X6zPl991Nguj0kip4f9y2bpbLN2miRyNWievV8F3cShakbr8BTSQuq5HISdWbmKIRitEjkpU4AEEpUiwDpIpCqDn3WRyFQOL+skkasCPtZNolAlPKyHRKkAD+shAQYlFkykidgcoiSIQiTKn2g6otWZA4Y41ojDlDnCiYuDua6IS5K5mglBwMgQRvwwkosReoy8ZEQtI6UVIeCXPtr7bFgkzd7HyivomCfSDxqOYr3jUPvqAAAAAElFTkSuQmCC')";
        $(close).on(tapName, function(e){
            e.stopPropagation();
            e.preventDefault();
            self._destroy();
        });
        //展示视频的div
        var videoDiv = document.createElement("div");
        videoDiv.id = "videoDiv";
        var videoDivStyle = videoDiv.style;
        videoDivStyle.width = "100%";
//        videoDivStyle.height = "700px";
//        videoDivStyle.margin = "260px auto";
        videoDivStyle.WebkitTransform = "translate(-50%,-50%)";
        videoDivStyle.transform = "translate(-50%,-50%)";
        videoDivStyle.position = "relative";
        videoDivStyle.top = "50%";
        videoDivStyle.left = "50%";
        videoDivStyle.textAlign = "center";
        videoDiv.innerHTML = content;
        this._supernatant.appendChild(close);
        this._supernatant.appendChild(videoDiv);
        this.__container.appendChild(this._supernatant);
    };

    IframeVideoPlayer.prototype._destroy = function(content){
        if(this._supernatant){
            this.__container.removeChild(this._supernatant);
            this.__blurLayer.style.WebkitFilter = "blur(0)";
            this._supernatant = null;

            //Iframe打开的时候派发视频结束的事件,备注和音频结束事件一样的只是为了主音乐重新播放
            var event = dms.createEvent(dms.OTHER_AUDIO_END, "iframe");
            dms.dispatcher.dispatchEvent(event);
        }
    };
    dms.IframeVideoPlayer = IframeVideoPlayer;
})(dms);