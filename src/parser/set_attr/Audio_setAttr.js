// 文件名称: Audio_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/6/19 14:57
// 描    述: 设置地图的属性
dms.Audio.createObject = function(item,scriptParser){
    var displayObject = new dms.Audio();
    //displayObject.userData = item;
    //
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Audio.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
		var el = this.contentElement;
		el.style.width = "62px";
		el.style.height = "62px";
        el.style.borderRadius = "100%";
//        el.style.border = "2px solid #fff"
//        el.style.borderRadius = "100%";
		var itemVal = item.item_val;
        var dataFor = item.data_for;
        if(dataFor){
            itemVal = this.userProperties.item_val;
        }

        el.style.background = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAMAAADOixOHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABGlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAACz+Fa2AAAAXHRSTlMAhHeK/mmR+jxx5RSHnwO2OwYW674Hs6QBXjkKuHUC05z4JVryCEb8qO1CgP0dg+R0X359MdlKEfDJDn/P+1ISeD3d2qlkF2Kmha4QDESBCekNBNxNbMXAP5ahFZTSyTUAAAABYktHRACIBR1IAAAACXBIWXMAAAsSAAALEgHS3X78AAABLklEQVQoz22S11bDMBAFBYgaIISShBaaTTMh9G7A9FBC7/v/38G9CvKxj6wHa3ZWWq8lK5UeLa0qa7SJbs/QHSLS2eX6bnjpybmJXib6XN+fh9cDSVUo8Dk4hMRwQo8US2XOo6w0FuvxCZFJQmUKfjr2rDszS5oDeb718wsIF0n+Emg53hAgWqmSSqDV2Ps1hGukdUAR80bzqDYR5glbgG1o0Ts2rBF2AXtm2T7DAzZudvKT1SGeRyYMQeyvYjwS+pg6hzAknJg6SJya5RHCM/ui8/SdXBAu//tsjisP4TXpBlC3unzLY7kD3XPBg/UNdtmwZbzH5PE8PQNeXtM3GYh+4/zOjVHiwgLTbpXVP9x7/+THfjn+m1V+HF03/9Wv49lVGCmVlcj6b21XSv0Br5lN9OvlDGIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDEtMjBUMTQ6NDE6NTcrMDg6MDBBCJ6JAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTAxLTIwVDE0OjQxOjU3KzA4OjAwMFUmNQAAAABJRU5ErkJggg==") no-repeat center rgba(0,0,0,.5)';
        //设置播放按钮,按钮图片本地化
        var playStyle = this._playAudio.style;
        this._playAudio.setAttribute("src", itemVal);
//        this._playAudio.setAttribute("preload", "preload");
        //modify by fishYu 2016-5-11 18:32 修改由于音频过度不预加载
        this._playAudio.setAttribute("preload", "none");
        this._playAudio.setAttribute("play-status", "play-normal");
//        this._playAudio.setAttribute("loop", "loop");
        playStyle.width = "100%";
        playStyle.height = "100%";
        playStyle.position = "absolute";
        playStyle.zIndex = "2";

        el.style.border = "0";
        //modify by fishYu 2016-3-3 13:32设置点击播放音频按钮动画
        var playAudioAnimateStyle = this._playAudioButtonAnimation.style;
        playAudioAnimateStyle.width = "62px";
        playAudioAnimateStyle.height = "62px";
        playAudioAnimateStyle.position = "absolute";
        playAudioAnimateStyle.top = "calc(50% - 31px)";
        playAudioAnimateStyle.left = "calc(50% - 31px)";
        playAudioAnimateStyle.top = "-webkit-calc(50% - 31px)";
        playAudioAnimateStyle.left = "-webkit-calc(50% - 31px)";
        playAudioAnimateStyle.zIndex = "1";
        playAudioAnimateStyle.margin = "0 auto";
        playAudioAnimateStyle.border = "0";
        playAudioAnimateStyle.background = "rgba(31, 29, 27, 0.4)";
        this.resetButtonAnimation();
//        playAnimateStyle.WebkitAnimationTimingFunction = "1s";
        playAudioAnimateStyle.borderRadius = "100%";

        //如果设置了自动播放就自动播放
        //TODO 这里有一个问题，就是有主音乐的时候，会有一个冲突
        var musicAutoplay = item.music_autoplay;
        this.endScript = item.animate_end_act;  //语音播放完之后的操作
        if(musicAutoplay) {
            // if (dms.isIOS()) {
            //     self._playAudio.addEventListener("loadstart", function(){
            //         self.changePlayStatus();
            //         self._playAudio.play();
            //     });
            // } else {
            //     self._playAudio.addEventListener("canplaythrough", function () {
            //         if (musicAutoplay) {
            //             self.changePlayStatus();
            //             self._playAudio.play();
            //         }
            //     });
            // }
            self._playAudio.load(); 
            if (dms.isIOS()  && dms.isWeiXinPlatform()) {
                var play = function(){  
                    self._playAudio.load(); 
                };  
                // wx  是否能取到
                window.wx && window.wx.ready(function () {
                    play();
                });
            }
            self._playAudio.addEventListener("loadstart", function(){
                self.changePlayStatus();
                self._playAudio.play();
            });
        }
    }
};



