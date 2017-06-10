// 文件名称: ClipPopupView
//
// 创 建 人: fishYu
// 创建日期: 2015/10/12 16:42
// 描    述: 涂抹图层
// 文件名称: ClipPopupView
(function(dms){
    /**
     *
     * @param container 插入涂抹图层的 DOM对象
     * @param wrapper 整个滑动对象的容器，获取缩放比例  wrapper,
     * @param data   涂抹图层的一些数据
     * @param clipContent   涂抹图层的中间内容
     * @param parent   当前的对象
     * @constructor
     */
    var ClipPopupView = function(container, data, clipContent, parent){
        this._container = container;
        var self = this;
        self.parentView = parent;
        //设置透明度
        var alpha = data.item_opacity   //涂抹透明度
        var itemColor = data.item_color;    //涂抹文字颜色
        var fontSize = data.font_size;  //涂抹文字大小
        var itemVal = data.item_val;    //涂抹文字
        var itemLeft = data.item_left || 0;  //文字的左边
        var itemTop = data.item_top || 0;    //文字的顶部
        var itemType = data.item_type;      //类型 24，  29
        this.clipPercent = data.clip_percent;    //涂抹百分比
        var itemHref = data.item_href;
        var itemWidth = data.item_width || 640;
        var itemHeight = data.item_height || 1008;
        this.endScript = data.animate_end_act;
        if(!itemHref){  //没有涂抹图片直接返回
            return;
        }
        //整个视频浮层
        if(!this._clipPopupView ){
            this._clipPopupView = document.createElement("canvas");
        }
        this._clipPopupView.width = itemWidth;
        this._clipPopupView.height = itemHeight;
        var style = this._clipPopupView.style;
        style.position = "absolute";
        style.zIndex = "100000";
        style.left = "0";
        style.top = "0";
        if(itemType == 29){   //刮刮乐的时候，真假话的时候
            style.left = itemLeft + "px";
            style.top = itemTop + "px";
            alpha = 100 - alpha;      //真假话的时候透明度为1
            //如果是假话的话，就添加动画
            var animate = data.item_animation;
            var animateVal = data.item_animation_val;
            this.addAnimation(animate, animateVal);
        }
        if(clipContent){
            itemVal = clipContent;
        }
        itemVal = itemVal.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        style.opacity = "1";
        style.webkitTransition = "opacity .5s";
        style.transition = "opacity .5s";
        this._container.appendChild(this._clipPopupView);
        this._clipCtx = this._clipPopupView.getContext("2d");


        this._clipCtx.globalAlpha = (100 - alpha) / 100;

        //设置字体样式
        if(!fontSize){
            self._clipCtx.font = "36px Arial";
        }else{
            self._clipCtx.font = fontSize + " Arial";
        }

        this.x1 = 0;
        this.y1 = 0;
        this.a = 30;
        this.timeout = null;
        this.totimes = 100;
        this.distance = 30;
        this.saveDot = [];
        //初始化的时候绘制涂抹层的图片
        this._img = new Image();
        var _src = itemHref;
        this._img.onload = function () {
            var rw = self._img.width / self._clipPopupView.width, rh = self._img.height / self._clipPopupView.height;
            if (rw > rh) {
                //image with rate is bigger then height, clip image with
                var clipW = rh * self._clipPopupView.width;
                var sx = (self._img.width - clipW) / 2;
                self._clipCtx.drawImage(self._img, sx, 0,clipW ,self._img.height,0,0,self._clipPopupView.width, self._clipPopupView.height);
            } else {
                var clipH = rh * self._clipPopupView.height;
                var sy = (self._img.height - clipH) / 2;
                self._clipCtx.drawImage(self._img, 0, sy,self._img.width ,clipH,0,0,self._clipPopupView.width, self._clipPopupView.height);
            }
            //TODO 这里的绘制椭圆的宽度和高度，定位都是根据字来的
            //1、字的位置-50
            //2、宽度为字的大小*长度
            //3、高度为字体的高度+30
            var fontInt = 36;
            if(fontSize){
                fontInt = parseInt(fontSize.substring(0, fontSize.length-2))
            }
            //从坐标点(itemLeft,itemTop)开始绘制文字  位置固定
            if(itemVal){
                //刮刮乐的时候，真假话的时候
                if(itemType == 29){
                    itemLeft = itemWidth / 2 - (fontInt * itemVal.length)/2;
                    itemTop = itemHeight / 2 + fontInt / 2;
                }
                //绘制圆背景 否层的时候添加文字阴影
                if(itemType != 29) {
                    var roundRectHeight = fontInt + 46; //绘制椭圆背景的高度
                    var tempTop = (roundRectHeight + fontInt) / 2 - 6;  //文字Y坐标需要减掉的Y轴坐标
                    var roundRectTop = itemTop - tempTop;
                    var roundRectLeft = itemLeft - 20;
                    var roundRectWidth = fontInt * itemVal.length + 20; //绘制椭圆的宽度
                    var roundRectR = roundRectHeight / 2;   //绘制椭圆的半径
                    self.roundRect(roundRectLeft, roundRectTop, roundRectWidth, roundRectHeight, roundRectR);
                    self._clipCtx.fill();
                }
                //绘制文字背景
                //设置字体填充颜色
                if(!itemColor){
                    self._clipCtx.fillStyle = "#909090";
                }else{
                    self._clipCtx.fillStyle = itemColor;
                }
                if(itemType == 29){
                    //字体总长
                    //真假话模版的相对x,y TODO 只是为了定做模版，之后可以修改
                    var tempX = itemWidth*0.1025;
                    var tempY = itemHeight*0.1;
                    var maxTempWidth = itemWidth*0.8159;
                    var lineHeight = data.line_height;
                    var textLen = self._clipCtx.measureText(itemVal).width;
                    var itemValArr = itemVal.split(/(?:\r\n|\r|\n)/);       //自动换行的行数大于1的时候。
//                    if(itemValArr.length <= 1 && (textLen > itemWidth)){    //单行字，但是超过canvas的宽度
                    if(itemValArr.length <= 1 && (textLen > maxTempWidth)){    //单行字，但是超过canvas的宽度
                        //字行数
//                        var tempNum = Math.ceil(textLen / itemWidth);
                        var tempNum = Math.ceil(textLen / maxTempWidth);
                        //字的总个数
                        var lenCount = itemVal.length;
                        //计算一行有多少个字

//                        var tempCount =  Math.floor(itemWidth / fontInt);
                        var tempCount =  Math.floor(maxTempWidth / fontInt);
                        for(var i = 0; i < tempNum; i++){
                            var getLen = tempCount > (lenCount - i*tempCount) ? (lenCount - i*tempCount) : tempCount;
                            var itemTempVal  = itemVal.substr(i*tempCount, getLen);
//                            self._clipCtx.fillText(itemTempVal,0, fontInt*(i+1));
                            self._clipCtx.fillText(itemTempVal,tempX, (fontInt + lineHeight)*(i+1) + tempY);
                        }
                    }else{
                        for(var i = 0; i < itemValArr.length; i++){
                            self._clipCtx.fillText(itemValArr[i],0, fontInt*(i+1));
                        }
                    }
                }else{
                    self._clipCtx.fillText(itemVal,itemLeft, itemTop);
                }


            }
            self.tapClip();
        };
        this._img.crossOrigin = "anonymous";
        this._img.src = _src;
//        var styleZoom = wrapper.style.zoom || "1";    //zoom缩放的时候
//        var styleZoom = wrapper.getAttribute("zoom-scale"); // transform的时候
//        this._zoom = Number(styleZoom);
    };
    ClipPopupView.prototype.getClipArea = function(e, hastouch){
        e.preventDefault();
        e.stopPropagation();
        var self = this;
        var x = hastouch ? e.targetTouches[0].pageX : e.clientX;
        var y = hastouch ? e.targetTouches[0].pageY : e.clientY;
        var ndom = this._clipPopupView;
//        修正缩放后的x,y值
        if(!ndom){  //预防报错
            return;
        }
        var rect = ndom.getBoundingClientRect();
//        x = ( ( x - rect.left ) * (ndom.width  / rect.width  ) ) / this._zoom;
//        y =  ( ( y - rect.top  ) * (ndom.height / rect.height ) ) / this._zoom;
        //不用zoom的时候
        x = ( ( x - rect.left ) * (ndom.width  / rect.width  ) );
        y =  ( ( y - rect.top  ) * (ndom.height / rect.height ) );

//        x -= ndom.offsetLeft;
//        y -= ndom.offsetTop;
        return {
            x: x,
            y: y
        }
    };
    //通过修改globalCompositeOperation来达到擦除的效果
    ClipPopupView.prototype.tapClip = function(){
        var self = this;
//        var hastouch = "ontouchstart" in window ? true : false,
        var hastouch = dms.isPC() ? false : true;
        var tapstart = hastouch ? "touchstart" : "mousedown",
            tapmove = hastouch ? "touchmove" : "mousemove",
            tapend = hastouch ? "touchend" : "mouseup";

        var area;
        var x2,y2;

        self._clipCtx.lineCap = "round";
        self._clipCtx.lineJoin = "round";
        self._clipCtx.lineWidth = self.a * 2;
        self._clipCtx.globalCompositeOperation = "destination-out";
        self._clipPopupView.addEventListener(tapstart, tapStartHandler);
        self._clipPopupView.addEventListener(tapend, tapEndHandler);

        /**
         * 移动开始处理函数
         * @param e
         */
        function tapStartHandler(e) {
            clearTimeout(self.timeout);
            e.preventDefault();
            e.stopPropagation();

            area = self.getClipArea(e, hastouch);
            if(!area){  //预防报错
                return;
            }
            self.x1 = area.x;
            self.y1 = area.y;
            self.drawLine(self.x1, self.y1);
            self._clipPopupView.addEventListener(tapmove, tapmoveHandler);
        }
        /**
         * 移动中处理函数
         * @param e
         */
        function tapmoveHandler(e) {
            clearTimeout(self.timeout);

            e.preventDefault();
            e.stopPropagation();

            area = self.getClipArea(e, hastouch);
            if(!area){  //预防报错
                return;
            }
            x2 = area.x;
            y2 = area.y;

            self.drawLine(self.x1, self.y1, x2, y2);

            self.x1 = x2;
            self.y1 = y2;
        }

        /**
         * 移动结束处理函数
         * @param e
         */
        function tapEndHandler(e) {
            e.preventDefault();
            e.stopPropagation();
            self._clipPopupView.removeEventListener(tapmove, tapmoveHandler);
            //检测擦除状态
            self.timeout = setTimeout(function () {
                var imgData;
                if (self._clipCtx){
                    imgData = self._clipCtx.getImageData(0, 0, self._clipPopupView.width, self._clipPopupView.height);
                    var dd = 0;
                    for (var x = 0; x < imgData.width; x += self.distance) {
                        for (var y = 0; y < imgData.height; y += self.distance) {
                            var i = (y * imgData.width + x) * 4;
                            if (imgData.data[i + 3] > 0) {
                                dd++
                            }
                        }
                    }
                }
                if(imgData){
                    var percent = 0.8;
                    if(self.clipPercent){
                        percent = (100-self.clipPercent) / 100;
                    }
                    // modify by fishYu 2016-2-17 13:52 更改涂抹比例的不精确
                    if(dms.isPC()){
                        percent = percent + 0.15;
                    }else{
                        percent = percent + 0.25;
                    }
//                        console.log(dd / (imgData.width * imgData.height / (self.distance * self.distance)),"sadasdasd " ,percent);
                    if (dd / (imgData.width * imgData.height / (self.distance * self.distance)) < percent) {
                        self._clipPopupView.className = "noOp";
                        //注销滑动事件
                        self._clipPopupView.removeEventListener(tapend,tapEndHandler);
                        self._clipPopupView.removeEventListener(tapmove, tapmoveHandler);
                        self._clipPopupView.removeEventListener(tapstart, tapStartHandler);
                        if(self.endScript){
//                                dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",self.endScript));
                            //TODO 更换了执行完的脚本
                            self.parentView.execAnimationEndAct();
                            //modify by fishYu Defect #1178  [显示模块]预览作品里涂抹后图集不显示 2016-8-19 10:16
                            var photoSwipeContent;
                            if(photoSwipeContent = self._container.querySelector("*[data-type='me-photo-swipe']")){
                                //派发监听摇一摇事件
                                var event = dms.createEvent("restart:photo:swipe:handle", "");
                                dms.dispatcher.dispatchEvent(event);
                            }
                        }
                        self._destroy();
                    }
                }
            }, self.totimes)
        }
    };
    ClipPopupView.prototype.drawLine = function(x1, y1, x2, y2){
        var self = this;
        self._clipCtx.save();
        self._clipCtx.beginPath();
        if(arguments.length==2){
            self._clipCtx.arc(x1, y1, self.a, 0, 2 * Math.PI);
            self._clipCtx.fill();
        }else {
            self._clipCtx.moveTo(x1, y1);
            self._clipCtx.lineTo(x2, y2);
            self._clipCtx.stroke();
        }
        self._clipCtx.restore();
    };
    ClipPopupView.prototype._destroy = function(content){
        if(this._clipPopupView){
            this.x1 = 0;
            this.y1 = 0;
            this.a = 30;
            this.timeout = null;
            this.totimes = 100;
            this.distance = 30;
            this.saveDot = [];
            this._img = null;
            this._clipCtx = null;
            this._container.removeChild(this._clipPopupView);
            this._clipPopupView = null;
        }
    };
    //圆角矩形
    ClipPopupView.prototype.roundRect = function (x, y, w, h, r) {
        //if (w < 2 * r) r = w / 2;
        //if (h < 2 * r) r = h / 2;
        this._clipCtx.beginPath();
        this._clipCtx.fillStyle  = "rgba(0,0,0,.5)";
        this._clipCtx.moveTo(x+r, y);
        this._clipCtx.arcTo(x+w, y, x+w, y+h, r);
        this._clipCtx.arcTo(x+w, y+h, x, y+h, r);
        this._clipCtx.arcTo(x, y+h, x, y, r);
        this._clipCtx.arcTo(x, y, x+w, y, r);
        // this.arcTo(x+r, y);
        this._clipCtx.closePath();
    };

    //添加动画
    ClipPopupView.prototype.addAnimation = function (animate,animationVal) {
        var el = this._clipPopupView;
        if(animate){
            dms.Css.addClass(this._clipPopupView, animate + " animated");
        }

        //解析动画参数
        if (animationVal != "undefined" && animationVal) {
            var params = JSON.parse(animationVal);

            var style = el.style;
            var delay = 0.3;
            //延迟时间
            if (params.delay) {
                delay = parseFloat(params.delay) + delay;
            }

            style["WebkitAnimationDelay"] = (delay) + "s";
            style["animationDelay"] = (delay) + "s";
            //动画持续时间
            if (params.duration) {
                style["WebkitAnimationDuration"] = params.duration + "s";
                style["animationDuration"] = params.duration + "s";
            }
            //动画次数
            if (params.infinite) {
                style["WebkitAnimationIterationCount"] = params.infinite;
                style["animationIterationCount"] = params.infinite;
            }
        }
    };
    dms.ClipPopupView = ClipPopupView;
})(dms);