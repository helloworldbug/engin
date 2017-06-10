// 文件名称: VideoPlayer
//
// 创 建 人: fishYu
// 创建日期: 2015/8/4 16:22
// 描    述: 视频播放器
// 文件名称: VideoPlayer
(function(dms){
    /**
     * @param container 插入iframeDOM对象
     * @param blurLayer 下层模糊的DOM对象
     * @param data   需要呈现的数据
     * @param targetLink   链接地址
     * @param itemType   元素类型，主要地图元素需要
     * @constructor
     */
    var IframePopupView = function(container, blurLayer, targetLink, itemType){
        var self = this;
        if(container.parentNode){
            container = container.parentNode;
        }
        var tapName = dms.getEventName();
        this._iframeContainer = container;
        this._iframeBlurLayer = blurLayer;
        this._iframeBlurLayer.style.WebkitFilter = "blur(7px)";
        //获取元素的属性值
//        var itemType = data.item_type;
//        var itemVal = data.item_val;
        var itemVal = targetLink;
        if(itemType && itemType == "15"){   //地图的时候
            //TODO 地图元素的时候，拼接iframe src 固定链接地址+所带的参数
            var jsonObj = JSON.parse(itemVal);
//            itemVal =  "http://ts.agoodme.com/views/map.html?lng=" + jsonObj.lng + "&lat=" + jsonObj.lat + "&zoom=" + jsonObj.zoom;
            itemVal = "http://www.agoodme.com/views1/map.html?lng=" + jsonObj.lng + "&lat=" + jsonObj.lat + "&zoom=" + jsonObj.zoom;
        }

        //整个视频浮层
        if(!this._iframeSupernatant){
            this._iframeSupernatant = document.createElement("div");
        }
        //在外部的时候增加缩放
        this._iframeSupernatant.className = "half-zoom";
        var style = this._iframeSupernatant.style;
        style.position = "absolute";
        style.zIndex = "100000";
        style.left = "0";
        style.top = "0";
        style.width = "100%";
        style.height = "100%";
        style.overflow = "auto";                    //解决ios里面不能滚动的问题，modify by fishYu 2016-1-28 19:11
        style.WebkitOverflowScrolling = "touch";
        style.backgroundColor = "rgba(0,0,0,.65)";

        //关闭按钮
        var close = document.createElement("div");
        var closeStyle = close.style;
        closeStyle.position = "absolute";
        closeStyle.zIndex = "2";
        closeStyle.left = "0";
        closeStyle.top = "0";
        closeStyle.width = "126px";
        closeStyle.height = "126px";
        closeStyle.background = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAV1BMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC7u7uRkZHs7OycnJwAAADxN0xuAAAAHHRSTlMABidFWm9+hIoKOmqHG1sXYUoYdTOGQ0zQvPDAdFT41AAAAAFiS0dEAIgFHUgAAAAJcEhZcwAACxIAAAsSAdLdfvwAAAFLSURBVEjHpZfZmoMgDIXB9VSpdevq+7/nWNvOFCcsenInX34hIYGDUpLpJM3yogTKIs/SRKtIO1S1gWWmrg4R4LFZcW+6OQbAUwuntScPqDsDj5nOGXQ/IGBDL5PjOUQC51EiL2HwaZf/5DWOBK475xTmHeNJwIq3j8jQV66+8qyDu2Lb8Le/3TYS6H6rz2xFzacm263kXM/vXrEGb3fZ+X6zPl991Nguj0kip4f9y2bpbLN2miRyNWievV8F3cShakbr8BTSQuq5HISdWbmKIRitEjkpU4AEEpUiwDpIpCqDn3WRyFQOL+skkasCPtZNolAlPKyHRKkAD+shAQYlFkykidgcoiSIQiTKn2g6otWZA4Y41ojDlDnCiYuDua6IS5K5mglBwMgQRvwwkosReoy8ZEQtI6UVIeCXPtr7bFgkzd7HyivomCfSDxqOYr3jUPvqAAAAAElFTkSuQmCC') center no-repeat";
        $(close).on(tapName, function(){
            self._destroy();
        });
        //创建一个iframe
        if(!this._myIframe){
            this._myIframe = document.createElement("iframe");
        }
        var realHeight = $(window).height() - 126;
        this._myIframe.name = "showframe" ;
        this._myIframe.width = "100%";
//        this._myIframe.height = "-webkit-calc(100% - 126px)";
        this._myIframe.marginwidth = "0";
        this._myIframe.marginheight = "0";
        this._myIframe.hspace = "0";
        this._myIframe.vspace = "0";
        this._myIframe.frameborder = "0";
        this._myIframe.scrolling = "yes";
        //设置iframe的路径
        this._myIframe.src = itemVal;
        var iframeStyle = this._myIframe.style;
        iframeStyle.position = "relative";
        iframeStyle.height = "100%";

        this._iframeSupernatant.appendChild(close);
        this._iframeSupernatant.appendChild(this._myIframe);
        this._iframeContainer.appendChild(this._iframeSupernatant);
    };
    IframePopupView.prototype._destroy = function(){
        if(this._iframeSupernatant){
            this._myIframe.src = "";
            this._iframeSupernatant.removeChild(this._myIframe);
            this._myIframe = null;
            this._iframeContainer.removeChild(this._iframeSupernatant);
            this._iframeBlurLayer.style.WebkitFilter = "blur(0)";
            this._iframeSupernatant = null;
        }
    };
    dms.IframePopupView = IframePopupView;
})(dms);