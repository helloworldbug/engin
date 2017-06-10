// 文件名称: Video_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/6/19 14:57
// 描    述: 设置地图的属性
dms.Video.createObject = function(item, scriptParser){
    var displayObject = new dms.Video();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Video.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
        var dataFor = item.data_for;
        if(dataFor){
//            itemHref = this.userProperties.item_href;
            this.userData.item_href = this.userProperties.item_href;
            this.userData.item_val = this.userProperties.item_val;
        }
		var el = this.contentElement;
        var itemWidth = item.item_width;
        var itemHeight = item.item_height;
		el.style.width = itemWidth + "px";
		el.style.height = itemHeight + "px";
		var itemVal = this.userData.item_val;
        var bgColor = item.bg_color;
        self.itemHref = this.userData.item_href;
        var tempBackgroundSize = "100% auto";
        if(itemVal){
            //modify by fishYu 2016-4-22 18:44 修改让视频的背景图片适配视频的区域
            itemVal = itemVal.split("?")[0]+"?imageView2/1/w/"+parseInt(itemWidth)+"/h/" +parseInt(itemHeight);
        }
        if(!self.itemHref){
            return;
        }
        if(self.itemHref.indexOf("iframe") > -1) {
            if(itemVal) {
                // 获取图片的宽高
                var imgTemp = new Image();
                // 改变图片的src
                imgTemp.src = itemVal;
                // 加载完成执行
                imgTemp.onload = function () {
                    var imgWidth = imgTemp.width;
                    var imgHeight = imgTemp.height;
                    if (imgWidth > imgHeight) {
                        tempBackgroundSize = "100% auto";
                    } else {
                        tempBackgroundSize = "auto 100%";
                    }
                    el.style.backgroundImage = 'url("' + itemVal + '")';
                    el.style.backgroundPosition = "center";
                    el.style.backgroundSize = tempBackgroundSize;
                    el.style.backgroundRepeat = "no-repeat";
                };
            }
            //设置播放按钮,按钮图片本地化
            var playStyle = this._playButton.style;
            playStyle.width = "88px";
            playStyle.height = "88px";
            playStyle.position = "absolute";
            playStyle.top = "calc(50% - 44px)";
            playStyle.left = "calc(50% - 44px)";
            playStyle.top = "-webkit-calc(50% - 44px)";
            playStyle.left = "-webkit-calc(50% - 44px)";
            playStyle.zIndex = "2";
            playStyle.margin = "0 auto";
            //modify by fishYu 2016-3-3 13：30修改视频播放按钮图标
            playStyle.background = "url('data:image/png;base64,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') center no-repeat";
            playStyle.backgroundSize = "cover";
            //设置播放按钮动画
            var playAnimateStyle = this._playButtonAnimation.style;
            playAnimateStyle.width = "100px";
            playAnimateStyle.height = "100px";
            playAnimateStyle.position = "absolute";
            playAnimateStyle.top = "calc(50% - 50px)";
            playAnimateStyle.left = "calc(50% - 50px)";
            playAnimateStyle.top = "-webkit-calc(50% - 50px)";
            playAnimateStyle.left = "-webkit-calc(50% - 50px)";
            playAnimateStyle.zIndex = "1";
            playAnimateStyle.margin = "0 auto";
            playAnimateStyle.background = "rgba(31, 29, 27, 0.4)";
            playAnimateStyle.WebkitAnimationName = "player-button";
            playAnimateStyle.WebkitAnimationDuration = "2.6s";
            playAnimateStyle.WebkitAnimationIterationCount = "infinite";
            playAnimateStyle.WebkitAnimationTimingFunction = "linear";
//        playAnimateStyle.WebkitAnimationTimingFunction = "1s";
            playAnimateStyle.borderRadius = "100%";

            this.contentElement.appendChild(this._playButton);
            this.contentElement.appendChild(this._playButtonAnimation);
            //iframe 点击事件
            self.addListener();
        }else{
            if(itemVal){
                // 获取图片的宽高
                var imgTemp = new Image();
                // 改变图片的src
                imgTemp.src = itemVal;
                // 加载完成执行
                imgTemp.onload = function(){
                    var imgWidth = imgTemp.width;
                    var imgHeight = imgTemp.height;
                    if(imgWidth > imgHeight){
                        tempBackgroundSize = "100% auto";
                    }else{
                        tempBackgroundSize = "auto 100%";
                    }
                    el.style.backgroundImage = 'url("'+itemVal+'")';
                    el.style.backgroundPosition = "center";
                    el.style.backgroundSize = tempBackgroundSize;
                    el.style.backgroundRepeat = "no-repeat";
                    //直接内嵌视频的时候
                    //TODO 设置背景图片根据 图片分辨率来设置不同 BackgrountSize， 有延迟
                    if(!self._videoPlayer){
                        self._videoPlayer = new dms.VideoPlayer(self.contentElement, self.userData, tempBackgroundSize, self);
                    }else{
                        return;
                    }
                };
            }else{
                if(!self._videoPlayer){
                    self._videoPlayer = new dms.VideoPlayer(self.contentElement, self.userData, tempBackgroundSize, self);
                }else{
                    return;
                }
            }
        }
        if(bgColor){
            el.style.backgroundColor = bgColor;
        }
    }
};


