// 文件名称: dms.Image
//
// 创 建 人: chenshy
// 创建日期: 2015/6/12 19:55
// 描    述: dms.Image
dms.Image = function(image,width,height){
	this.element = document.createElement("img");
    dms.DisplayObject.call(this);
    this._image = null;

    this.loaded = false;
    this.delayEventTime = 5;
//    this.element = document.createElement("img");
};

dms.inherit(dms.Image,dms.DisplayObject);

Object.defineProperties(dms.Image.prototype,{
    image: {
        get: function(){
            return this._image;
        },
        set: function(url){
            var el = this.element;
            var self = this;

            this._image = dms.ImageLoader.getImage(url,function(imgObj){
                if(!self.element) return;
                if(!imgObj){
                    self._dispatchImageLoadErrorEvent();
                }else{
                    if(!self._width){
                        self.width = imgObj.width;
                    }

                    if(!self._height){
                        self.height = imgObj.height;
                    }

//                console.log(self.backgroundImage);
                    el.src = imgObj.src;
//                console.log("dispatcher");
                    self._dispatchImageLoadedEvent();
                }
            });
        }
    }
});

//dms.Image.prototype.__defineGetter__("image",function(){
//    return this._image;
//});
//
//dms.Image.prototype.__defineSetter__("image",function(url){
//
//});

/**
 * 图片加载完成事件
 * @param fun
 * @private
 */
dms.Image.prototype._dispatchImageLoadedEvent = function(fun) {
    var _self = this;
	if(!_self.element){
		return;
	}
    setTimeout(function() {
        if (fun)

            fun();

        try {
            var customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(dms.IMAGE_LOADED, false, false);
            _self.element.dispatchEvent(customEvent);
        } catch(e) {
            var customEvent = document.createEvent("HTMLEvents");
            customEvent.initEvent(dms.IMAGE_LOADED, false, false);
            _self.element.dispatchEvent(customEvent);
        }
        _self.loaded = true;
    }, _self.delayEventTime);
};

/**
 * 图片加载异常，派发异常事件
 * @private
 */
dms.Image.prototype._dispatchImageLoadErrorEvent = function(){
    var _self = this;
	if(!_self.element){
		return;
	}
    setTimeout(function() {
        try {
            var customEvent = document.createEvent('CustomEvent');
            customEvent.initCustomEvent(dms.IMAGE_LOAD_ERROR, false, false);
            _self.element.dispatchEvent(customEvent);
        } catch(e) {
            var customEvent = document.createEvent("HTMLEvents");
            customEvent.initEvent(dms.IMAGE_LOAD_ERROR, false, false);
            _self.element.dispatchEvent(customEvent);
        }
        _self.loaded = false;
    }, _self.delayEventTime);
};

