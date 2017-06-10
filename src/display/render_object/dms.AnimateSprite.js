// 文件名称: AnimateSprite
//
// 创 建 人: chenshy
// 创建日期: 2015/5/20 15:48
// 描    述: 图片
(function(dms){
    var AnimateSprite = function(image,width,height){
        var imageEl = this.contentElement = document.createElement("div");
        dms.RenderObject.call(this);
        //var imageEl = this.contentElement;
        imageEl.style.backgroundRepeat = "no-repeat";

        this._imageUrl = "";

        this._imageRect = null;

        //console.log("GG");

        this.loaded = false;
        this.delayEventTime = 5;

    };

    dms.inherit(AnimateSprite,dms.RenderObject);

    var p = AnimateSprite.prototype;

    Object.defineProperties(p,{
        image: {
            get: function(){
                return this._imageUrl;
            },
            set: function(url){
                var self = this;

                this._imageUrl = dms.ImageLoader.getImage(url,function(imgObj){
                    if(!self.contentElement) return;
                    if(!imgObj){
                        self._dispatchImageLoadErrorEvent();
                    }else{
                        if(!self._contentWidth){
                            self.setContentWidth(imgObj.width);
                        }

                        if(!self._contentHeight){
                            self.setContentHeight(imgObj.height);
                        }

//                console.log(self.backgroundImage);
                        self.contentElement.style.backgroundImage = "url('" + imgObj.src + "')";
//                self.contentElement.src = imgObj.src;
                        //self.contentElement.id = "eeeeee";
                        //console.log(imgObj.src);
//                console.log("dispatcher");
                        self._dispatchImageLoadedEvent();
                    }
                });
            }
        },
        imageRect: {
            set: function(rect){
                var el = this.contentElement;
                //if(!rect || rect.length < 2){
                //    el.style.backgroundSize = "100% 100%";
                //    return;
                //}
                ////console.log("haha");
                //
                if(!rect){
                    return;
                }
                this._imageRect = rect;
                var x = parseInt(rect[0]);
                var y = parseInt(rect[1]);
                ////var width = parseInt(rect[2]);
                ////var height = parseInt(rect[3]);
                //
                ////var s = x + "px " + y + "px " + width + "px " + height + "px";
                ////console.log(s);
                //
                ////el.style.clip = "rect(" + s + ")";
                el.style.backgroundPosition = x + "px " + y + "px";
                //el.style.backgroundSize = "256px 1024px";
                //el.style.backgroundSize = "";
            }
        }
    });

//    p.__defineGetter__("image",function(){
//        return this._imageUrl;
//    });
//
//    p.__defineSetter__("image",function(url){
//        //var el = this.contentElement;
//        var self = this;
//
//        this._imageUrl = dms.ImageLoader.getImage(url,function(imgObj){
//            if(!self.contentElement) return;
//            if(!imgObj){
//                self._dispatchImageLoadErrorEvent();
//            }else{
//                if(!self._contentWidth){
//                    self.setContentWidth(imgObj.width);
//                }
//
//                if(!self._contentHeight){
//                    self.setContentHeight(imgObj.height);
//                }
//
////                console.log(self.backgroundImage);
//                self.contentElement.style.backgroundImage = "url('" + imgObj.src + "')";
////                self.contentElement.src = imgObj.src;
//                //self.contentElement.id = "eeeeee";
//                //console.log(imgObj.src);
////                console.log("dispatcher");
//                self._dispatchImageLoadedEvent();
//            }
//        });
//    });

    //p.__defineSetter__("imageRect",function(rect){
    //    var el = this.contentElement;
    //    //if(!rect || rect.length < 2){
    //    //    el.style.backgroundSize = "100% 100%";
    //    //    return;
    //    //}
    //    ////console.log("haha");
    //    //
    //    if(!rect){
    //        return;
    //    }
    //    this._imageRect = rect;
    //    var x = parseInt(rect[0]);
    //    var y = parseInt(rect[1]);
    //    ////var width = parseInt(rect[2]);
    //    ////var height = parseInt(rect[3]);
    //    //
    //    ////var s = x + "px " + y + "px " + width + "px " + height + "px";
    //    ////console.log(s);
    //    //
    //    ////el.style.clip = "rect(" + s + ")";
    //    el.style.backgroundPosition = x + "px " + y + "px";
    //    //el.style.backgroundSize = "256px 1024px";
    //    //el.style.backgroundSize = "";
    //});

    /**
     * 图片加载完成事件
     * @param fun
     * @private
     */
    p._dispatchImageLoadedEvent = function(fun) {
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
    p._dispatchImageLoadErrorEvent = function(){
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

///**
// * 设置图片宽度
// * @param width
// */
//dms.ImageSprite.prototype.setImageWidth = function(width){
//    this._image.width = width;
//};
//
///**
// * 设置图片高度
// * @param height
// */
//dms.ImageSprite.prototype.setImageHeight = function(height){
//    this._image.height = height;
//};


    p.destroy = function(){
        dms.RenderObject.prototype.destroy.call(this);
    };

    dms.AnimateSprite = AnimateSprite;
})(dms);