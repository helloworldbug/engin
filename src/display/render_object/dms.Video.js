// 文件名称: Video
//
// 创 建 人: fishYu
// 创建日期: 2015/6/23 17:06
// 描    述: 视频
dms.Video = function(){
    this._playButton = document.createElement("div");
    this._playButtonAnimation = document.createElement("div");

    dms.RenderObject.call(this);

};

dms.inherit(dms.Video,dms.RenderObject);

dms.Video.prototype._showVideoContent = function(){
    var content  = this.userData.item_href;
    if(!content){
        return;
    }
    this.containerEl = this.parent.element;
    if(content.indexOf("iframe") > -1){
        var contentWrapper = this.stage || this.parent.stage;
        new dms.IframeVideoPlayer(contentWrapper[0], this.containerEl, content);
        //Iframe打开的时候派发视频打开的事件
        var event = dms.createEvent(dms.VIDEO_PLAY, "iframe");
        dms.dispatcher.dispatchEvent(event);
    }
};
//销毁
dms.Video.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
    if(this._videoPlayer){
        this._videoPlayer.destroy();
    }
};
/**
 * 投票点击事件
 */
dms.Video.prototype.addListener = function(){
    var self = this;
    if(self.itemHref.indexOf("iframe") > -1){
        this.onClick = function(e){
            e.stopPropagation();
            e.preventDefault();
            self._showVideoContent();
        };
    }else{
        if(self._videoPlayer){
            self._videoPlayer.addListener();
        }
    }
};