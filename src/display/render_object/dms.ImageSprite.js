// 文件名称: ImageSprite
//
// 创 建 人: chenshy
// 创建日期: 2015/5/20 15:48
// 描    述: 图片
(function(dms){

    var nilImage = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+/iiiigD/2Q==";

    var ImageSprite = function(image,width,height){
        var imageEl = this.contentElement = document.createElement("img");
        dms.RenderObject.call(this);
        //var imageEl = this.contentElement;
        imageEl.style.backgroundRepeat = "no-repeat";
        imageEl.style.display = "block";

        this._imageUrl = "";

        this._imageRect = null;


        this.loaded = false;
        this.delayEventTime = 5;

    };

    dms.inherit(ImageSprite,dms.RenderObject);

    var p = ImageSprite.prototype;

    Object.defineProperties(p,{
        image: {
            get: function(){
                return this._imageUrl;
            },
            set: function(url){
                //var el = this.contentElement;
                var self = this;
//                console.log("rr");

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
//                self.contentElement.style.backgroundImage = "url('" + imgObj.src + "')";
                        self.contentElement.src = imgObj.src;
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
                if(!rect || rect.length < 2){
                    el.style.backgroundSize = "100% 100%";
                    return;
                }
                //console.log("haha");

                this._imageRect = rect;
                var x = parseInt(rect[0]);
                var y = parseInt(rect[1]);
                //var width = parseInt(rect[2]);
                //var height = parseInt(rect[3]);

                //var s = x + "px " + y + "px " + width + "px " + height + "px";
                //console.log(s);

                //el.style.clip = "rect(" + s + ")";
                el.style.backgroundPosition = x + "px " + y + "px";
                el.style.backgroundSize = "";
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
////                self.contentElement.style.backgroundImage = "url('" + imgObj.src + "')";
//                self.contentElement.src = imgObj.src;
//                //self.contentElement.id = "eeeeee";
//                //console.log(imgObj.src);
////                console.log("dispatcher");
//                self._dispatchImageLoadedEvent();
//            }
//        });
//    });

    //p.__defineSetter__("imageRect",function(rect){
    //    var el = this.contentElement;
    //    if(!rect || rect.length < 2){
    //        el.style.backgroundSize = "100% 100%";
    //        return;
    //    }
    //    //console.log("haha");
    //
    //    this._imageRect = rect;
    //    var x = parseInt(rect[0]);
    //    var y = parseInt(rect[1]);
    //    //var width = parseInt(rect[2]);
    //    //var height = parseInt(rect[3]);
    //
    //    //var s = x + "px " + y + "px " + width + "px " + height + "px";
    //    //console.log(s);
    //
    //    //el.style.clip = "rect(" + s + ")";
    //    el.style.backgroundPosition = x + "px " + y + "px";
    //    el.style.backgroundSize = "";
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
                _self.element && _self.element.dispatchEvent(customEvent);
            } catch(e) {
                var customEvent = document.createEvent("HTMLEvents");
                customEvent.initEvent(dms.IMAGE_LOADED, false, false);
                _self.element && _self.element.dispatchEvent(customEvent);
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
                _self.element && _self.element.dispatchEvent(customEvent);
            } catch(e) {
                var customEvent = document.createEvent("HTMLEvents");
                customEvent.initEvent(dms.IMAGE_LOAD_ERROR, false, false);
                _self.element && _self.element.dispatchEvent(customEvent);
            }
            _self.loaded = false;
        }, _self.delayEventTime);
    };

    p.destroyImage = function(){
        //var width = this._contentWidth;
        //var height = this._contentHeight;
        //var url = this._imageUrl.split("?")[0];
        //
        //if(url){
        //    //http://ac-hf3jpeco.clouddn.com/e9e574e3b68f4ea316fe.jpg?imageView2/2/format/jpg
        //    url = url + "?imageView2/2/w/" + (width / 4) + "/" + (height/4) + "";
        //    this.contentElement.src = nilImage;
        //}

    };

    p.resumeImage = function(){
        //if(this.contentElement.src != this._imageUrl){
        //    this.contentElement.src = this._imageUrl;
        //}
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

    dms.ImageSprite = ImageSprite;
})(dms);