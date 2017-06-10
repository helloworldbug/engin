// 文件名称: PhotoSwipe
//
// 创 建 人: fishYu
// 创建日期: 2015/12/28 19:40
// 描    述: 图集
// 文件名称: PhotoSwipe
(function(dms){
    /**
     *
     * @param container 插入图集的对象容器
     * @param data   图集的数据
     * @constructor
     */
    var PhotoSwipe = function(container,data, callback){
        this.__container = container;
        var self = this;
        self._callback = callback;
        var itemWidth = data.item_width;
        var itemHeight = data.item_height;
        this.myPhotosSwipe = null;
        //整个swipe 容器
        if(!this._photosWrapper){
            this._photosWrapper = document.createElement("div");
        }
        this._photosWrapperId = "photos-swipe"+ dms.getNewID();
        this._photosWrapper.id = this._photosWrapperId;
//        this._photosWrapper.setAttribute("date-type", "me-photo-swipe");
        var _photosWrapperStyle = this._photosWrapper.style;
        _photosWrapperStyle.overflow = "hidden";
//        _photosWrapperStyle.width = "100%";
        _photosWrapperStyle.width = itemWidth + "px";
        _photosWrapperStyle.height = itemHeight + "px";
//        _photosWrapperStyle.height = "100%";
        _photosWrapperStyle.position = "relative";
        _photosWrapperStyle.visibility = "hidden";
        _photosWrapperStyle.position = "absolute";
        _photosWrapperStyle.zIndex = "-1";

        //容器的滚动
        this.photosScroller = document.createElement("div");
        var photosScrollerStyle = this.photosScroller.style;
        photosScrollerStyle.overflow = "hidden";
//        photosScrollerStyle.width = itemWidth + "px";
        photosScrollerStyle.height = "100%";
        photosScrollerStyle.position = "relative";

        //整个swipe容器焦点
        if(!this._photosDot){
            this._photosDot = document.createElement("div");
        }
        var photosDotStyle = this._photosDot.style;
        photosDotStyle.width = "100%";
//        photosDotStyle.position = "relative";
        photosDotStyle.position = "absolute";
        photosDotStyle.textAlign = "center",
        photosDotStyle.height = "15px";
//        photosDotStyle.overflow = "hidden";
        photosDotStyle.lineHeight = "15px";
        photosDotStyle.zIndex = "6";
//        photosDotStyle.marginTop = "-30px";
        //兼容不同手机的显示焦点图。
        var f = $(window).width();
        var bottomVal = 30;
        if(f > 640 && f  < 828){
            bottomVal = 45;
        }else if(f  >= 828){
            bottomVal = 53;
        }
        photosDotStyle.bottom = bottomVal + "px";
        this._photosDotId = "photos-dot" + dms.getNewID();
        this._photosDot.id = this._photosDotId;

        //容器的滚动
        this.photosDotUl = document.createElement("div");
        var photosDotUlStyle = this.photosDotUl.style;
        photosDotUlStyle.width = "100%";
        photosDotUlStyle.height = "15px";
//        photosDotUlStyle.margin = "0 auto";
        photosDotUlStyle.textAlign = "center";

        this._photosWrapper.appendChild(this.photosScroller);
        this.__container.appendChild(this._photosWrapper);
        this._photosDot.appendChild(this.photosDotUl);
        this.__container.appendChild(this._photosDot);
        this.loadPhotosData(data);
        //监听滑动页的事件
        dms.dispatcher.on("restart:photo:swipe:handle", function(e){
            e.stopPropagation();
            e.preventDefault();
            self.killPhotosSwipe();
            self.photosDataLoaded();
        });
    };
    /**
     * 渲染Photos数据
     * @param arr
     */
    PhotoSwipe.prototype.loadPhotosData = function(data){
        var self = this;
        var htmls = [];
        var ulHtml  = [];
        var itemVal = data.item_val;
        var itemHref = data.item_href;
        var itemWidth = data.item_width;
        var itemHeight = data.item_height;
        var arr = itemVal.split("|");
        var hrefArr = itemHref.split("@");
        var arrLen = arr.length;
        var index = 0;
        for(var i=0;i<arrLen;i++){
            var imgUrl = arr[i];
            var htmlstr = "";
            var ulHtmlStr = "";
//            var imgHei = itemHeight;
            //TODO 处理预加载
            var img = new Image();
            img.__index = i;
            img.onload = function(){
                var bannertarget = hrefArr[this.__index];
                if(bannertarget != "undefined"  &&  bannertarget != "" && bannertarget != null && bannertarget != " "){
                    htmlstr = "<img style='float:left; width: "+itemWidth+"px;  height: "+itemHeight+"px; position: relative;' data-event-index="+this.__index+"  src="+this.src+" />";
                }else{
                    htmlstr = "<img style='float:left; width: "+itemWidth+"px;  height: "+itemHeight+"px;  position: relative;' src="+this.src+ " />";
                }
                //防止图片和事件错位
                htmls[this.__index] =htmlstr;
                if(index == 0){
                    ulHtmlStr = "<span style ='width: 15px; height: 15px; box-sizing: border-box;margin-left: 15px; border-radius: 100%; background: rgba(255,255,255,.5); border : 1px solid rgba(0,0,0,.5); list-style: none; display: inline-block;' class='photos-on' ></span>";
                }else{
                    ulHtmlStr = "<span style ='width: 15px;height: 15px; box-sizing: border-box; margin-left: 15px; border-radius: 100%; background: rgba(255,255,255,.5); border : 1px solid rgba(0,0,0,.5); list-style: none; display: inline-block;'></span>";
                }
                index++;
                ulHtml.push(ulHtmlStr);
                if(arrLen == index){
                    self.photosScroller.innerHTML = htmls.join('');
                    //TODO 需要按照点的（宽度 + 15）*总长度 + 15 > 总宽度的时候 来计算是否显示
                    var dotWidthTemp = 15;      //点的宽度
                    var dotMarginLeftTemp = 15; //点的左边距
                    var allDotWidth = (dotWidthTemp + dotMarginLeftTemp)*arrLen + dotMarginLeftTemp;
                    if(allDotWidth <= itemWidth){
                        self.photosDotUl.innerHTML = ulHtml.join('');
                    }
                    self.photosDataLoaded();
                }
            };
            img.src = imgUrl;
        }
    };
    /*
     * 图集数据加载完成之后
     * 启用 图集 的滚动和touch
     */
     PhotoSwipe.prototype.photosDataLoaded = function(){
         var self = this;
         var lis = $(this.photosDotUl).find("span");
         setTimeout(function(){
             self.myPhotosSwipe = new Swipe(self._photosWrapper,{
                 startSlide: 0,
                 speed: 800,
                //  auto: 2000,
                 continuous: true,
                 disableScroll: false,
                 stopPropagation: false,
                 callback: function(pos) {
                     if(lis.length > 0){   //增加一个所有点的宽度+边距小于总宽度的时候才有span
                         var i = lis.size();
                         while (i--) {
                             lis.get(i).className = '';
                         }
                         if(lis.get(pos)){
                             lis.get(pos).className = 'photos-on';
                         }
                     }
                 }
             });
             self._callback && self._callback();
         }, 200);
    };
    PhotoSwipe.prototype.killPhotosSwipe = function(){
        if(this.myPhotosSwipe){
            var lis = $(this.photosDotUl).find("span");
            for(var i = 0; i < lis.length; i++){
                lis[i].className = "";
            }
            lis[0].className = "photos-on";
            this.myPhotosSwipe.kill();
            this.myPhotosSwipe = null;
        }
    };

    PhotoSwipe.prototype.destroy = function(){
        if(this._photosWrapper){
            dms.dispatcher.removeAllEventListeners("restart:photo:swipe:handle");
            if(this.myPhotosSwipe){
                this.myPhotosSwipe.kill();
            }
            this.myPhotosSwipe = null;
            this._callback = null;
            this.__container.removeChild(this._photosWrapper);
        }
    };
    dms.PhotoSwipe = PhotoSwipe;
})(dms);