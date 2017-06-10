// 文件名称: dms.MagazineDisplay2
//
// 创 建 人: chenshy
// 创建日期: 2016/3/15 10:23
// 描    述: dms.MagazineDisplay2
var CustomerData = window.fmacloud && fmacloud.Object.extend("me_customerdata");
(function(dms){
    //transparent
    var sectionTpl = "<section class=\"swiper-slide\" style='border:0;font-size:50px;width:100%;height:100%;background:transparent;overflow-y: hidden;overflow-x: hidden;-webkit-box-sizing:border-box;" +
        "-webkit-overflow-scrolling:touch;-webkit-touch-callout:none'>";

    function initSwiperAnimation(swiper){
        //初始化自定义动画
        var animations = dms.pageAnimation;
        for(var i in animations){
            swiper.addTransition(i,animations[i]);
        }
    }

    var randomColors = ['#ffffff','#ff0000','#00ff00','#0000ff','#cccc00','#cc00cc','#ff9900','#cc5500'];

    function getSectionHtml(n){
        n = n || 2;
        var html = "",i;

        for(i = 0;i < n;i++){
            var index = Math.floor(Math.random() * randomColors.length);
            var se = sectionTpl.replace('#TTT',randomColors[index]);
//            html += se + dms.getNewID() + "</section>";
            html += se + "</section>";
        }
        return html;
    }

    function createSwiper(container){
        var swiper = new pageSwitch(container,{
            duration:800,           //int 页面过渡时间
            direction:0,            //int 页面切换方向，0横向，1纵向
            start:this._currentPage,                //int 默认显示页面
            loop:this.isLoop,             //bool 是否循环切换
            ease:'ease',            //string|function 过渡曲线动画，详见下方说明
            transition:'scrollX',    //string|function转场方式，详见下方说明
            freeze:this._animationMode.lock,           //bool 是否冻结页面（冻结后不可响应用户操作，可以通过 `.freeze(false)` 方法来解冻）
            mouse:true,             //bool 是否启用鼠标拖拽
            mousewheel:true,       //bool 是否启用鼠标滚轮切换
            autoplay : this._animationMode.autoplay,
            filterCla : "pro-wrapper",
            interval : this._animationMode.interval,
            callback : this.swiperCallback,
            dependentObj : this
        });

        return swiper;
    }

    var MagazineDisplay = function(container){
        this._cName = container;
        this.$swiperContainer = $(this._cName);
        this.id = dms.getNewID();
        this.$wrapper = this.$swiperContainer.find(".swiper-wrapper");

        this.$wrapper.attr("id","swiper-wrapper-" + this.id);

        this.$wrapper.css({
            width: "100%",
            height: '100%'
        });

        //是否可循环滑动
        this._isLoop = false;
        this.defaultInterval = 10000;
        //默认动画配置
        this._animationMode = {
            "name":"scrollY",
            "autoplay":false,
            "interval":this.defaultInterval,
            "direction":1,
            "lock":false
        };
        //ME期刊的自动播放
        this.playTimer = null;
        this.magazinePlaying = false;
        this._bookIndex = -1;
        this._pageIndex = -1;
        //记录每本书翻的页数
        this._pageRecord = [];

        this._vSwipers = [];

        this._hIndex = 0;
        this._vIndex = 0;

        this._tpl = null;           //作品数据缓存
        this._directoryType = 1;    //目录类型,单列黑色
        this._isPeriodicals = false;    //是够是多组的期刊
        this.initPageNumStatus = true;  //第一组属否默认显示页码
        this._pageNumType = 0;          //页码样式
        this._periodicalsLogo ="http://ac-hf3jpeco.clouddn.com/732817be6780a51f3b43.jpg";// "http://ac-hf3jpeco.clouddn.com/12b6637e2ec678d1d31d.jpg";     //TODO 期刊品牌LOGO,后期会根据组或者作品来替换, 默认背景LOGO
//        this._periodicalsLogo = "./images/12.jpg";     //测试用
        //容器，
        var arr = this._sectionContainers = [];
        arr[0] = [];
        arr[1] = [];

        this._matrixNum = 2;
        this.tplsLength = 0;
        //arr[2] = [];

        //翻页时延迟加载页数据
        this._pageTimer = null;
        this._initHSwiper();

        this._initVSwiper();

        this.eventManager = new dms.EventManager(this.$swiperContainer[0]);

        dms.dispatcher.on('pageto',this.pageToHandle,this);
	    //modify by fishYu 2016-3-28 9:39增加缩放作品适应屏幕
        this._initScreen();
        //add by fishYu 2016-4-8 14:30 增加作品提交的保存
        dms.dispatcher.on('submit',this.submitDataHandle,this);
        //add by fishYu 2016-4-11 15:12 增加内部打开链接的方式
        dms.dispatcher.on('open:inner:link',this.openInnerLinkHandle,this);
        //<div id="gulpProgress" style="position: absolute; height: 10px; width: 0px; z-index: 1000; left: 0px; opacity: 1; bottom: 6px; border-radius: 5px; background-color: rgba(0, 0, 0, 0.6);transition: opacity 800ms;"></div>
        var gulpProcess = document.createElement("div");
        gulpProcess.id = "gulpProgress";
        gulpProcess.style["position"] = "absolute";
        gulpProcess.style["height"] = "300px";
        gulpProcess.style["width"] = "0px";
        gulpProcess.style["z-index"] = "1000";
        gulpProcess.style["left"] = "0px";
        gulpProcess.style["opacity"] = "0";
        gulpProcess.style["bottom"] = "6px";
        gulpProcess.style["border-radius"] = "5px";
        gulpProcess.style["transform"] = "translateX(0%)";
        gulpProcess.style["-webkit-transform"] = "translateX(0%)";
        gulpProcess.style["transition"] = "transform 800ms";
        gulpProcess.style["-webkit-transition"] = "-webkit-transform 800ms";
        gulpProcess.style["pointer-events"] = "none";
        this.$swiperContainer.append(gulpProcess);

    };

    var p = MagazineDisplay.prototype;
    /**
     * 以内部打开链接的方式打开网页
     * @param e
     */
    p.openInnerLinkHandle = function(e){
        var self = this;
        var mm = self.magazineManager;
        if(!mm) return;
        var full_url = e.data;
        if(full_url){
            var container = mm.getDomByIndex(self.pageIndex, self.bookIndex);
            new dms.IframePopupView(self.$swiperContainer[0], container, full_url);
        }
    };
    /**
     * 是否允许翻页的回调方法
     * @param e
     * @returns {boolean}
     */
    p.swiperCallback = function(e){
        var target = e.target;
        var canSwipe = target.getAttribute("can-swipe");
        if(canSwipe == "yes"){
            return false;
        }else if(canSwipe == "no"){
            return true;
        }
    };
    p.pageToHandle = function(e){
        var id = e.data;
        if(isNaN(id)){
            this.pageToId(id);
        }else{
            this.pageTo(id,0);
        }
    };
    /**
     * 提交作品表单信息
     */
    p.submitDataHandle = function(e){
        var self = this;
        var mm = self.magazineManager;
        if(!mm) return;
        var container = mm.getDomByIndex(self.pageIndex, self.bookIndex);
        var tplData ={"tpl_id" : self._tpl.tpl_id, "author": self._tpl.author}
        //TODO 修改每页都可以重复提交
        var pageContainer = $(container);
        dms.model.addFeedbackInfor(tplData, pageContainer, self.$swiperContainer);
    };
    /**
     * 水平方向创建section
     * 如果作品只有一个维度，根据设置来定义横向和纵向
     * @private
     */
    p._initHSwiper = function(){
        var self = this;
        self.$wrapper.html(getSectionHtml(self._matrixNum));

        var swiper = self.hSwiper =  createSwiper.call(self,self.$wrapper.get(0));
        self.hSwiper.loop = true;
        swiper.on("after",function(){
            //console.log("bookAfter");
            self._bookSwiperAfter(this.directionFlag,this.current);
        });

        swiper.on('dragStart',function(){
            //console.log("bookStart");
            self._bookSwiperStart(this.directionFlag,this.current);
        });

        initSwiperAnimation(swiper);
    };

    p._initVSwiper = function(){
        var self = this;
        if(self._initVSwipered){
            return;
        }
        self._initVSwipered = true;
        var arr = this._sectionContainers;

        self.$wrapper.children("section").each(function(i,o){
            var html = getSectionHtml(self._matrixNum);
            //add by fishYu 2016-4-22 19:06设置初始的背景 图片
            //todo 后期可能需要根据组来更换不同logo,需要优化，先出背景后出内容
            var bottomLogo = "";
            if (!dms.NO_BOTTOM_LOGO){
                bottomLogo = self._periodicalsLogo;
            }
            html = html.replace(/transparent/g, 'url('+bottomLogo+') no-repeat center');
            var tempHtmlId = 'inner-wrapper'+i;
            var tempHtml =  "<div style='width:100%;height:100%;' id='"+tempHtmlId+"' >"+html+"</div>"
            var $t = $(this);
//            $t.html(html);
            $t.html(tempHtml);

            $t.find("section").each(function(j,o2){
                //console.log(i);
                arr[i].push($(o2));
            });
            var swiper = createSwiper.call(self,$t.find("#"+tempHtmlId)[0]);
            swiper.setTransition('scrollY');
            swiper.direction = 1;
            swiper.loop = true;
            self._vSwipers.push(swiper);
            self._vSwipers[i].on('after',function(){
                self._pageSwiperAfter(this.directionFlag,this.current);
            });

            self._vSwipers[i].on('dragStart',function(){
                self._pageSwiperStart(this.directionFlag,this.current);
            });


        });

        //console.log(arr);
    };

    p._bookSwiperStart = function(dir,index){

        //add by fishYu 2016-4-9 -11:59 修改基组的时候翻组出问题
        var bi = this.bookIndex;
        var chIndex = 0;
        if(dir == 1){
            chIndex = bi - 1;
        }else if(dir == -1){
            chIndex = bi + 1;
        }
        if(chIndex < 0 || chIndex >= this.bookLength){
            this.hSwiper.loopPage = false;
            return;
        }else{
            this.hSwiper.loopPage = true;
        }

        var bookIdx,
            sIndex;

        if(dir == -1){
            bookIdx = this.bookIndex + 1;
            sIndex = mUtils.limitNum(index + 1,this._matrixNum);
        }else if(dir == 1){
            bookIdx = this.bookIndex - 1;
            sIndex = mUtils.limitNum(index - 1,this._matrixNum);
        }

        //console.log(bookIdx);
        if(bookIdx !== undefined){
            //console.log("before bookIndex:",this.bookIndex,this.pageIndex);
            var vIndex = this._vSwipers[sIndex].current,
                idx = this.getPageIndex(bookIdx);
//            console.log(idx,bookIdx,vIndex,sIndex, "book before");
            this._fillHtml(idx,bookIdx,vIndex,sIndex);
        }
    };

    p._fillHtml = function(i1,i2,vIndex,hIndex){
        var self = this;
        var mm = this.magazineManager;
        vIndex = mUtils.limitNum(vIndex,this._matrixNum);
        hIndex = mUtils.limitNum(hIndex,this._matrixNum);
        //modify by fishYu 判断是否需要重新添加事件

        var dom = mm.getDomByIndex(i1,i2,true);

        if(!dom){
            return;
        }
        var secs = this._sectionContainers,
            sec = secs[hIndex][vIndex];
        if(dom.parentNode){
            dom.parentNode.removeChild(dom);
        }
        //预防一直存在，删除添加的尾层
        var endImg = sec.find("#endImg");
        if(endImg){
            endImg.remove();
        }
        //把替换放到之前，不然可能会在尾页出错
        sec.html(dom);  //根据底图做了一个细小的改动modify by fishYu 2016-8-9 14:00
       /** var temp  = '<div id="endImg" style="position: absolute;height: 50%;bottom:0;left:2px;width: 636px;background: url(http://ac-hf3jpeco.clouddn.com/5e9bdd81114a8787c7bc.png) no-repeat 50% -webkit-calc(100% - 50px);background-color: #e9e9e9;"></div>';
        var currentGroupPageLength = mm.getPageLength(i2);
        if((i1 == currentGroupPageLength - 1 ) && i2 == (mm.scriptParsers.length -1 )){
            if(typeof(dom) == "string"){
            }else{
                //modify by fishYu 由于设置了默认图片，此时默认图片还没被替换
//                dom = dom.outerHTML;
            }
            sec.prepend($(temp));
//            dom =  temp + dom;
        }**/
//        sec.html(dom);
        setTimeout(function(){
            var pageAnimation = self.scriptParser.getPageAnimation(i1);
            var pageLock = false;
            if(pageAnimation && pageAnimation.hasOwnProperty("lock")){
                pageLock = pageAnimation.lock ;
            }
            var downArrow =  null;
            var horizontalArrow = null;
            var leftArrow = null;
            var rightArrow = null;
            if($.find("#arrow")){
                downArrow = $.find("#arrow")[0];
                horizontalArrow = $.find("#arrowHorizontal")[0];
                leftArrow = $(horizontalArrow).find("#arrow-left")[0];
                rightArrow = $(horizontalArrow).find("#arrow-right")[0];
            }
            //console.log(dom, $(abc).hide());
            //console.log("当前组:"+(i2+1)+"    当前组当前页:"+(i1+1));
            //console.log("总组数:"+this.bookLength+"    当前组总页数:"+this.magazineManager.getPageLength(i2));
            var transYRegex = /\.*translateY\((.*)px\)/i;
            var pageIndex = i1 + 1;
            var pageLength = self.magazineManager.getPageLength(i2);
            var bookIndex = i2 +1;
            var bookLength = self.bookLength;
            var scrollTop = 0;
            var maxScrollTop = 0;
            //modify by fishYu 2016-9-5 18:20修改锁定左右翻组的不提示箭头
           //f_slip_status获取组的是否禁止翻组的开关字段
            var slipStatus = self.getGroupFreezeStatus(i2);
            // 如果当前页被锁定或者全局被锁定则不显示任何箭头
            if(pageLock|| self._animationMode.lock ){
                downArrow && downArrow.style && (downArrow.style["display"] = "none");
                horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "none");
                leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                rightArrow && rightArrow.style && (rightArrow.style["display"] = "none");
            }else if(dom.getAttribute){
                maxScrollTop = parseInt(dom.getAttribute("data-height")) - 1008;
                if(transYRegex.exec(dom.style.transform)){
                    scrollTop = parseInt(transYRegex.exec(dom.style.transform)[1]) * -1;
                }
                if(pageIndex == pageLength && scrollTop == maxScrollTop){
                    downArrow && downArrow.style && (downArrow.style["display"] = "none");
                    if((bookIndex < bookLength) && !slipStatus){    //添加一个锁定水平组的条件，再显示
                        horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "block");
                        leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                        rightArrow && rightArrow.style && (rightArrow.style["display"] = "block");
                        setTimeout(function(){
                            horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "block");
                            leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                            rightArrow && rightArrow.style && (rightArrow.style["display"] = "block");
                            //modify by fishyu 2017-1-7 在ie10中自动刷新重启
                            // document.execCommand('Refresh');
                        },800);
                    }else{
                        //$(horizontalArrow).hide();
                        horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "none");
                        leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                        rightArrow && rightArrow && (rightArrow.style["display"] = "none");
                        setTimeout(function(){
                            horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "none");
                            leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                            rightArrow && rightArrow.style && (rightArrow.style["display"] = "none");
                            //modify by fishyu 2017-1-7 在ie10中自动刷新重启
                            // document.execCommand('Refresh');
                        },800);
                    }
                }else{
                    downArrow && downArrow.style && (downArrow.style["display"] = "block");
                    horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "none");
                    leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                    rightArrow && rightArrow.style && (rightArrow.style["display"] = "none");
                    setTimeout(function(){
                        downArrow && downArrow.style && (downArrow.style["display"] = "block");
                        horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "none");
                        leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                        rightArrow && rightArrow.style && (rightArrow.style["display"] = "none");
                        //modify by fishyu 2017-1-7 在ie10中自动刷新重启
                        // document.execCommand('Refresh');
                    },800);
                }
            }else{
                downArrow && downArrow.style && (downArrow.style["display"] = "none");
                horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "none");
                leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                rightArrow && rightArrow.style && (rightArrow.style["display"] = "none");
                setTimeout(function(){
                    downArrow && downArrow.style && (downArrow.style["display"] = "none");
                    horizontalArrow && horizontalArrow.style && (horizontalArrow.style["display"] = "none");
                    leftArrow && leftArrow.style && (leftArrow.style["display"] = "none");
                    rightArrow && rightArrow.style && (rightArrow.style["display"] = "none");
                    //modify by fishyu 2017-1-7 在ie10中自动刷新重启
                    // document.execCommand('Refresh');
                },600);
            }
        },100);
    };
    /**  todo
     * 这里需要改动下
     * @param bookIndex 有可能不传值
     * @returns {*}
     */
    p.getPageIndex = function(bookIndex){
        if(bookIndex == undefined || bookIndex == null){
            return this.pageIndex;
        }
        return this._pageRecord[bookIndex] || 0;
    };

    p._pageSwiperStart = function(dir,index){
        var idx,sIndex;
        if(dir == -1){
            idx = this.pageIndex + 1;
            sIndex = mUtils.limitNum(index + 1,this._matrixNum);
        }else if(dir == 1){
            idx = this.pageIndex - 1;
            sIndex = mUtils.limitNum(index - 1,this._matrixNum);
        }
        if(idx !== undefined){
            this._fillHtml(idx,this.bookIndex,sIndex,this.hSwiper.current);
        }
    };

    p._bookSwiperAfter = function(dir,current){
	    var self = this;
        if(this.hIndex == current){
            return;
        }

        this.hIndex = current;
        if(dir == -1){
            this.bookIndex++;
        }else if(dir == 1){
            this.bookIndex--;
        }
        //console.log("bookIndex:",this.bookIndex,this.pageIndex);
	    //add by fishYu 2016-3-28 17:20增加页码
        //设置页的长度
//        self.resetPageNumWidgetContent(self.pageIndex+1, self.pageLength);
        //水平翻组回调
        this.onBookSwipeTouchEnd();
        self.swipeTouchEnd();
        self.swipeEnd();
        //水平翻页的时候显示还是隐藏页码组件
        self.changeGroupPageNumStatus();
        self.setCurrentGroupSlipStatus();
    };

    p._pageSwiperAfter = function(dir){
	    var self = this;
        if(dir == -1){
            self.pageIndex++;
        }else if(dir == 1){
            self.pageIndex--;
        }

        self.swipeTouchEnd();
        self.swipeEnd();
    };

    p.swipeTouchEnd = function(){
        //add by fishYu 2016-4-5 12:25 修改获取页的 DOM容器
        var self = this;
        var mm = self.magazineManager;
        if(!mm) return;
        var container = mm.getDomByIndex(self.pageIndex, self.bookIndex);
        var photoSwipeContent,shakeContent;
        //debug.log("ss toucnend");
        //TODO 预防尾页的时候，是html string
        if(container && typeof(container) != "string" && (shakeContent = container.querySelector("*[data-type='me-shake']"))){
            //派发监听摇一摇事件
            var event = dms.createEvent("start:shake:handle", "");
            dms.dispatcher.dispatchEvent(event);
        }else{
            //派发停止摇一摇事件
            var event = dms.createEvent("stop:shake:handle", "");
            dms.dispatcher.dispatchEvent(event);
        }
        if(container && typeof(container) != "string" &&  (photoSwipeContent = container.querySelector("*[data-type='me-photo-swipe']"))){
            //派发监听摇一摇事件
            var event = dms.createEvent("restart:photo:swipe:handle", "");
            dms.dispatcher.dispatchEvent(event);
        }
        //派发事件,  TODO 第一次打开的时候不派发事件
        var event = dms.createEvent(dms.SWIPE_TOUCH_END, "");
        dms.dispatcher.dispatchEvent(event);
        this.onSwipeTouchEnd();

        //设置页的长度
        self.resetPageNumWidgetContent(self.pageIndex+1, self.pageLength);
        //modify by fishYu 2016-5-17 09:30 修改增加页的动画,和设置页是否锁定
        if (this.swiper) {
            this.setCurrentPageAnimation();
        }
    };

    p.onSwipeTouchEnd = function(){};
    /**
     * 水平翻组结束回调
     */
    p.onBookSwipeTouchEnd = function(){};

    //属性定义
    Object.defineProperties(p,{
        swiper: {
            get: function(){
                this._vSwipers[0].currentSwiper = 1;
                this._vSwipers[1].currentSwiper = 2;
                return this._vSwipers[0];
            }
        },
        //
        isLoop : {
            get : function(){
                return this._isLoop;
            },
            set : function(value){
                this._isLoop = value;
                var swiper = this._vSwipers[0];
                swiper.loop = value;
                //if(this.swiper){
                //    this.swiper.loop = value;
                //}
            }
        },
        switchType: {
            get: function(){
                return !!this._switchType;
            },
            set: function(value){
                this._switchType = value;
                if(value == 2){
                    this._initVSwiper();
                }
            }
        },
        //书索引
        bookIndex: {
            get: function(){
                return this._bookIndex;
            },
            set: function(value){
                if(this._bookIndex == value){
                    return;
                }
                this._bookIndex = this.magazineManager.limitBookIndex(value);
                //this._bookChange = true;
                if(this._pageRecord[value] !== undefined){
                    this.pageIndex = this._pageRecord[value];
                    this._bookChange = false;
                }
            }
        },
        //页索引
        pageIndex: {
            get: function(){
                //return this._pageIndex;
                return this._pageRecord[this._bookIndex] || 0;
            },
            set: function(value){
                //if(value < 0) return;

                value = this.magazineManager.limitPage(value,this.bookIndex);

                this._pageRecord[this._bookIndex] = value;
                //if(this._bookChange){
                //    this._loadPage(value,this.bookIndex);
                //}
            }
        },
        animationName: {
            set : function(value){
                this._animationName = value;
                //console.log(value)
                if(this.swiper){
                    //this.swiper.mouseLock = !!dms.animationMouseLock[value];
                    //this.swiper.mouseLock = true;
                }
            },
            get : function(){
                return this._animationName;
            }
        },
        hIndex: {
            get: function(){
                return this._hIndex;
            },
            set: function(value){
                this._hIndex = value;
            }
        },
        vIndex: {
            get: function(){
                //var hIndex = this.hIndex;
                //var vSwiper = this._vSwipers[hIndex];
                //return vSwiper.current;
                return this._vIndex;
            }
        },
        bookLength: {
            get: function(){
                if(this.magazineManager){
                    return this.magazineManager.tpls.length;
                }
                return 0;
            }
        },
        //对me微杂志有效
        pageLength: {
            get: function(){
                return this.getPageLength(0);
            }
        },
        //对me微杂志有效
        currentPage: {
            get: function(){
//                return this._pageRecord[0];
                return this._pageRecord[this._bookIndex] || 0;
            }
        },
        //对me微杂志有效
        scriptParser :{
            get : function(){
                var self = this;
                var mm = self.magazineManager;
                if(!mm){
                    return null;
                }
                return mm.scriptParsers[self.bookIndex]
            }
        }
    });

    p.getPageLength = function(bookIndex){
        if(this.magazineManager){
            bookIndex = bookIndex || this.bookIndex;
            return this.magazineManager.getPageLength(bookIndex);
        }
        return 0;
    };
    /**
     * 对外的接口，ME期刊形式获取所有页的总和
     */
    p.getAllPagesLength = function(){
        if(this.magazineManager){
            return this.magazineManager.getAllPagesLength();
        }
        return 0;
    };
    //加载页
    p._loadPage = function(i1,i2){
        this._fillHtml(i1,i2,this.vIndex,this.hIndex);
        this._preLoadPage(i1,i2);
        //console.log(dom);
    };

    //预加载页 以i1,i2为中心，加载上下左右页
    p._preLoadPage = function(i1,i2){
        var hIndex = this.hIndex,
            vIndex = this.vIndex,
            j1 = i1,
            j2 = i2, h,v;
        //加载上
        j1 = i1 - 1;
        v = vIndex - 1;
        this._fillHtml(j1,i2,v,hIndex);

        //加载下
        j1 = i1 + 1;
        v = vIndex + 1;
        this._fillHtml(j1,i2,v,hIndex);

    };



    //不可重复调用
    p.showMagazine = function(tplData,i1,i2){
        var self = this;
        //根据删除字段来判断增加一个层遮盖页面
//        var tplDelete = tplData.tpl_delete;
//        if(tplDelete == 0){
//            //删除的作品把音乐也删除掉
//            tplData.tpl_music = "";
//            self._insertDeleteLayer();
//        }
        self.switchType = mUtils.getSwitchType(tplData);
        self._tpl = tplData;
        //console.log(tplData);
        self._tplClass = tplData.tpl_class;
        //self._currentPage = pageIndex || 0;
        //self._showIndex = pageIndex;

        self._directoryType = tplData.list_style || 1;   //目录样式
        //TODO 做一个字段类型的兼容老的page_style，新的page_num_style:'{"style":0,"color":"rgb(0,0,0)"}'
        var page_num_style = tplData.page_num_style;
        if(page_num_style == undefined){        //没有值的情况
            self._pageNumType = tplData.page_style;   //页码样式
        }else{
            page_num_style = JSON.parse(page_num_style);
            self._pageNumType = page_num_style.style;
        }
        self.magazineManager = new dms.MagazineManager(tplData, this.$swiperContainer);
        var tplSign = tplData.tpl_sign || 0;

        //add by fishYu 2016-4-6 19:24单组或者兼容老版本的时候，左右滑动禁止的
        var tpls = self.magazineManager.tpls;
        //组的长度
        self.tplsLength = tpls.length;
        if(self.tplsLength < 2){
            self.hSwiper.freeze(true);
        }else{
            self._isPeriodicals = true; //是否是多组的期刊
        }
        i2 = i2 || 0;
        //TODO 后期需要替换字段,初始显示页码的状态， show_page_num：ture表示组内显示页码，false表示不显示，（默认为true）

        self._dataHandle(tplData);
        self.setCurrentPage(i1,i2);
        if(tplSign == 2){
            self.initPageNumStatus =(tplData.groups)[i2].show_page_num;
            //创建页码组件
            //初始的时候第一组的页码，和总页长度
            var _data = null;
            if(page_num_style){
                _data = {};
                _data.color = page_num_style.color;
            }
            self.createPageNumWidget(_data,i1, self.pageLength);
        }
        //add by fishYu 2016-4-20 设置自动播放
        self.magazinePlaying = self._animationMode.autoplay;
        if(!dms.isPC() && self.magazinePlaying){
            self.playMagazine();
        }
        //modify by fishYu 2016-4-29 初始设置锁定的时候锁定竖翻
        if(self._animationMode.lock){
            self.swiper.freeze(true);
        }
        this._pauseOtherAudios = this.pauseOtherAudios.bind(this);
        this._pausePlayAudio = this.pausePlayAudio.bind(this);
        //绑定关闭其他事件
        dms.dispatcher.on(dms.OTHER_AUDIO_PLAY, this._pauseOtherAudios);
        //主音乐播放
        dms.dispatcher.on(dms.MANI_AUDIO_PLAY, this._pausePlayAudio);
        //视频播放
        dms.dispatcher.on(dms.VIDEO_PLAY, this._pausePlayAudio);
        //监听长按处理
        dms.dispatcher.on("long:press", function(e){
            var dataTarget = e.target;
            if(dataTarget.itemHref){
                e.stopPropagation();
                e.preventDefault();
                self.itemHrefHandle(dataTarget.itemHref, e, dataTarget.openLinkWay);
            }
        });
    };
    /**
     * 增加表示作品删除的层
     * @private
     */
    p._insertDeleteLayer = function(){
        var self = this;
        var dom = document.createElement("div");
        var style = dom.style;
        style.width = "100%";
        style.height = "100%";
        style.position = "absolute";
        style.top = 0;
        style.left = 0;
        style.zIndex = "10000000";
        style.fontSize = "50px";
        style.color = "#ffccdd";
        style.background = "#000";
        dom.innerHTML = "页面已删除";
        self.$swiperContainer.parent().append($(dom));
    }
    /**
     * 数据处理
     * @param tpl
     * @private
     */
    p._dataHandle = function(tpl){
        //重置一些设置
        if(tpl.animation_mode){
            var animationMode = JSON.parse(tpl.animation_mode);
            for(var i in animationMode){
                this._animationMode[i] = animationMode[i];
                if (i == "interval") {  //重置默认秒数
                    this.defaultInterval = parseInt(animationMode[i]);
                }
            }
        }
    };

    /**
     * 安装音乐播放器
     */
    p.installMusicPlayer = function(){
        if(!this._isMusicPlayerSetup){
            var tpl,
                mm;
            if(this.magazineManager && (tpl = this.magazineManager.tpl)){
                //tpl_music_replay
                //console.log(tpl.tpl_music_lrc);
                //tpl_music_autoplay
                this.musicPlayer = new dms.MusicPlayer({
                    lrcContainer : this.$swiperContainer[0],
                    url : tpl.tpl_music,
                    lrcConfig : tpl.tpl_music_lrc ? new dms.toJSON(tpl.tpl_music_lrc) : "",
                    loop : true,        //tpl.tpl_music_replay -- 后期动态设置
                    autoplay : false, //tpl.tpl_music_autoplay,
                    lrcOn : tpl.tpl_lrc_on
                });
                this._isMusicPlayerSetup = true;
            }
        }
    };

    /**
     * 设置当前页
     */
    p.setCurrentPage = function(i1,i2,PcDirFlag){
	    var self = this;
        if(!self.magazineManager){
            return;
        }

        i2 = i2 || 0;

        self.bookIndex = i2;
        self.pageIndex = i1;
        self._fillHtml(i1,i2,self.hSwiper.current,self._vSwipers[self.hSwiper.current].current);
	    //add by fishYu 更新页码的显示
//        self.resetPageNumWidgetContent(self.pageIndex+1, self.pageLength);
        //modify by fishYu 2016-4-7 11:09 修改增加页的动画
        if(this.swiper){
            this.setCurrentPageAnimation();
        }
        //modify by fishYu 2016-8-31 10:54 改变组的状态
        if(this.hSwiper){   
            this.setCurrentGroupSlipStatus();
        }
    };

    //根据页的id来跳转
    p.pageToId = function(id){
        var mm = this.magazineManager;
        var pagePos = mm.getPagePosById(id);

        if(pagePos[0] != -1){
            this.pageTo(pagePos[0],pagePos[1]);
        }
        //console.log(pagePos);
    };
    //TODO 水平方向的下一组
    p.hNext = function(){
        this.bookIndex += 1;
        this.pageTo(this.pageIndex,this.bookIndex);
    };
    //TODO 水平方向的上一组
    p.hPrev = function(){
        this.bookIndex -= 1;
        this.pageTo(this.pageIndex,this.bookIndex);
    };
    //TODO 垂直方向的下一页
    p.vNext = function(){
        this.pageIndex += 1;
        this.pageTo(this.pageIndex,this.bookIndex);
    };
    //TODO 垂直方向的上一页
    p.vPrev = function(){
        this.pageIndex -= 1;
        this.pageTo(this.pageIndex,this.bookIndex);
    };
    //跳转到i2章i1页
    p.pageTo = function(i1,i2){
        var self = this;
        if(i2 == undefined || i2 == null){
            i2 = this.bookIndex;
        }
        //为了兼容之前老的跳转
        i1 = parseInt(i1);
        var bookIndex = this.bookIndex,
            pageIndex = this._pageRecord[i2] || 0;

        var bookLength = this.bookLength;
        if(i2 < 0){
            i2 = 0;
        }else if(i2 > bookLength - 1){
            i2 = bookLength - 1;
        }
        var pageLength = this.getPageLength(i2);
        if(i1 < 0){
            i1 = 0;
        }else if(i1 > pageLength - 1){
            i1 = pageLength - 1;
        }

        var curHindex = this.hSwiper.current,
            vSwiper = this._vSwipers[curHindex],
            curVindex = vSwiper.current;
        this._fillHtml(i1,i2,curVindex,curHindex);

        this.bookIndex = i2;
        this.pageIndex = i1;
        //add by fishYu 2016-4-18 12:16增加一个点击跳转的回调
        this.pageToEnd();
        //自动翻页的时候需要
        this.swipeTouchEnd();
        //add by fishYu 更新页码的显示
//        self.resetPageNumWidgetContent(this.pageIndex+1, this.pageLength);
        //modify by fishYu 2016-8-31 10:54 改变组的状态
        if(this.hSwiper){   
            this.setCurrentGroupSlipStatus();
        }        
    };
    /**
     * add by fishYu 2016-4-18 12:16增加一个点击跳转的回调
     */
    p.pageToEnd = function(){};
    /**
     * 手滑动结束的事件
     */
    p.swipeEnd = function(){};
    function calcSwiperIndex(dir,index){
        if(dir == -1){
            index--;
        }else if(dir == 1){
            index++;
        }
        return index;
    }

    function getDir(index,currIndex){
        var dir = 0;
        if(index == currIndex){
            dir = 0;
        }else if(index > currIndex){
            dir = 1;
        }else if(index < currIndex){
            dir = -1;
        }
        return dir;
    }

    //设置当前动画
    p.setCurrentPageAnimation = function(){
        var self = this;
//        if(self._isPeriodicals){  //在ME期刊的时候,多组期刊的时候
//            return;
//        }
//        return;   //modify by fishYu 2016-4-7 11:10 修改设置每页动画
        if(!this.scriptParser){
            return;
        }
        var pageAnimation = this.scriptParser.getPageAnimation(this.currentPage );//- this._offset
        var pageSizes = this.scriptParser.getPageSizes()[this.currentPage];
        var lockScroll;
        var interval;
        var dir = 1,
            name = this.animationName;
        var pageLock = false;
        if(pageAnimation){
//            dir = pageAnimation.direction === undefined ? 1 : pageAnimation.direction;
//            name = pageAnimation.name || name;
//            lockScroll = pageAnimation.lock_scroll;
//            interval = pageAnimation.interval;
            //设置单页不能滑动 ， TODO 可能不需要提示
            pageLock = pageAnimation.lock || false;
            if(!this._animationMode.lock  && this.swiper && this.swiper.freeze){
                this.swiper.freeze(pageLock);
            }
        }else{
//            dir = this._animationMode.direction === undefined ? 1 : this._animationMode.direction;
//            name = this._animationMode.name || name;
//            lockScroll = this._animationMode.lock_scroll;
//            interval = this._animationMode.interval;
            //没有设置全局锁的时候， 单页锁全部设置 false
            if(!this._animationMode.lock && this.swiper && this.swiper.freeze){
                this.swiper.freeze(pageLock);
            }
        }
//
//        // TODO 随机动画
//        if(name == 'random'){
//            //创建一个随机方向
//            var randNum = Math.round(Math.random());
//            dir = randNum;
//            var tempRandomAnimation = this._randomAnmation[randNum];
//            var index = Math.floor(Math.random() * tempRandomAnimation.length);
//            this.swiper.setTransition(tempRandomAnimation[index]);
//        }else{
//            this.swiper.setTransition(name);
//        }
//
//        //var time = Math.random() * 7 * 1000;
//        //console.log(time);
//        //modify by fishYu 2016-4-22 18:01 去掉方向的改变
//        dir = 1;
//        this.swiper.setInterval(interval);
//        this.swiper.direction = dir;
//        //console.log(pageSizes );//- this._offset
//        if(pageSizes && (pageSizes[0] > this._scWidth || pageSizes[1] > this._scHeight)){
//            this.swiper.mouseLock = true;
//        }else{
//            this.swiper.mouseLock = false;
//        }

//        if(lockScroll){
//
//            var page = this.swiper.pages[this.currentPage];
//            //console.log(page);
//            page.style["overflow"] = "hidden";
//        }

        //console.log(this.swiper.mouseLock);
//        this.swiper.mouseLock = !!dms.animationMouseLock[name];
//        this.animationName = name;
        //设置显示提示动画
        //单页的情况下不提示切页提示,多页的时候, 锁定到时候不提示翻页提示
        //created by fishYu 添加提示按钮的事件穿透
        //上下翻动
        //var verticalArrow = this.$swiperContainer.find("*[data-type='magazine-arrow']");
        //verticalArrow.addClass("noEvents");
        ////左右翻动
        //var horizontalArrow = this.$swiperContainer.find("*[data-type='arrow-horizontal']");
        //horizontalArrow.addClass("noEvents");
        if(this.pageLength > 1 && !this._animationMode.lock){
            //if(dir== 0){    //左右显示
            //    verticalArrow.removeClass("show").addClass("hide");
            //    if(!pageLock){      //新增单页锁定的时候不显示提示按钮
            //        horizontalArrow.removeClass("hide").addClass("show");
            //    }else {
            //        horizontalArrow.removeClass("show").addClass("hide");
            //    }
            //}else{  //上下显示
            //    horizontalArrow.removeClass("show").addClass("hide");
            //    if(this._tplClass == 1 && (this.currentPage == (this.pageLength -1))){    //个人行业并且最后一页的时候
            //        verticalArrow.removeClass("show").addClass("hide");
            //    }else{
            //        if(!pageLock){      //新增单页锁定的时候不显示提示按钮
            //            verticalArrow.removeClass("hide").addClass("show");
            //        }else {
            //            verticalArrow.removeClass("show").addClass("hide");
            //        }
            //    }
            //}
        }
        // 将横向侧翻和纵向侧翻强制改为滑动动画，横向侧翻与纵向侧翻测试稳定没有bug的时候可以改回来
        if(name == "leftRight3DX" || name == "leftRight3DY" || name == "leftRight3D"){
            name = "scrollY";
        }
        //modify by fishYu 2016-4-22 18:01 去掉动画名称的改变
        name = "scrollY";
        this.swiper.setTransition(name);
    };
    /**
     *设置水平翻组的状态,锁定还是滑动
     */
    p.setCurrentGroupSlipStatus = function () {
        var self = this;
        //TODO 设置水平翻页的测试， 2016-8-10 17：14   需要优化，不管翻页或者翻组的时候都会触发的
        if (this.hSwiper) {
            //TODO 创建作品的目录,组数据
            var slipStatus = self.getGroupFreezeStatus(this.bookIndex);
           if(slipStatus){
               this.hSwiper.freeze(true);
           }else{
               this.hSwiper.freeze(false);
           }
       }
    },

    /**
     *
     * @param html
     * @param i1 页
     * @param i2
     */
    p.appendSlide = function(html,i1,i2){
    	var self = this;
        var mm = self.magazineManager;
        if(!mm) return;
        i2 = i2 || (self.tplsLength - 1);
        mm.appendPage(html,i1,i2);
	    //add by fishYu 页的长度+1
        //更新页码
        self._pageLength += 1;
        self.resetPageNumWidgetContent(self.pageIndex+1,self.pageLength);
    };

    p.uninstallMusicPlayer = function(){
        if(this._isMusicPlayerSetup){
            if(this.musicPlayer){
                this.musicPlayer.destroy();
                this._isMusicPlayerSetup = false;
            }
        }
    };

    //计时结束
    var countdownOver = function(e){
        var data = e.target;
        this.itemHrefHandle(data);
    };

    p.clear = function(){
        this._currentPage = 0;
        this._pageLength = 0;
        this._isPeriodicals = false;    //是否是多组的期刊
        this._isLoop = false;
        this._map = null;
        this._tpl = null;            //作品数据对象缓存
        this._directoryType = 1;    //目录类型
        this._pageNumType = 0;      //页码样式
        this._mouseLock = false;
        this._initDispatchEvent = true;
        this.tplsLength = 0;
        this.hasLongPage = false;
        this.$wrapper.html("");
        if(this.scriptParser){
            this.scriptParser.destroy();
        }
        this.scriptParser = null;
        this.magazinePlaying = false;
        if(this.playTimer){
            window.clearInterval(this.playTimer);
        }
        this.playTimer = null;
    };

    p.destroy = function(){
        this.clear();
        this.pageContainers = [];
        if(this.swiper){
            this.swiper.animationPages = [];
            this.swiper.animationInPages = [];
            this.swiper.animationOutPages = [];
            this.swiper.destroy();
        }

        Cyan.destroyAll();
        this.$wrapper = null;
        this.$swiperContainer = null;
        dms.ObjectManager.clear();
//        this._onceSubmit = true;
        this._submitCallbackData = null;
        dms.dispatcher.removeAllEventListeners('pageto');
        dms.dispatcher.removeAllEventListeners(dms.OTHER_AUDIO_PLAY);
        dms.dispatcher.removeAllEventListeners(dms.MANI_AUDIO_PLAY);
        dms.dispatcher.removeAllEventListeners(dms.VIDEO_PLAY);
        dms.dispatcher.removeAllEventListeners("long:press");
        dms.dispatcher.removeAllEventListeners('submit');
        dms.dispatcher.removeAllEventListeners("countdown:over");
        this.uninstallMusicPlayer();
        this._pauseOtherAudios = null;
        this._pausePlayAudio = null;
    };
    /****************************************
     * add by fishYu 2016-3-29 9:18
     * 以下为增加的函数
     ***************************************/
    /**
     * 按照屏幕的适配来缩放，全屏显示作品
     * @private
     */
    p._initScreen = function(){
        var container = this.$swiperContainer[0];
        if(!container) return;
        var cwidth = container.clientWidth;
        var cheight = container.clientHeight;

        var wrapper = this.$wrapper[0];
        if(!wrapper) return;
        var width = wrapper.clientWidth;
        var height = wrapper.clientHeight;

        var y = 0;
        if(cheight > height){
            y = (cheight - height) / 2;
        }

        var stage = container.parentNode;
        if(!stage){
            return;
        }

        var stageWidth = stage.clientWidth;
        var stageHeight = stage.clientHeight;
        var scaleX = 1,scaleY = 1,scale = 1;
        if(cwidth > stageWidth || cheight > stageHeight){
            if(cwidth > stageWidth){
                scaleX = stageWidth / cwidth;
            }

            if(cheight > stageHeight){
                scaleY = stageHeight / cheight;
            }

            scale = Math.min(scaleX,scaleY);
        }else{
            scaleX = stageWidth / cwidth;
            scaleY = stageHeight / cheight;
            scale = Math.min(scaleX,scaleY);
        }

        var translatePercent = ((scale - 1) / 2 * 100);
        //modify by fishYu  2016-4-18 12:18 在android手机的QQ里面，来优化显示不全的BUG
        var userAgent = navigator.userAgent.toLowerCase();
        if(userAgent.indexOf("qq/") > -1  && (/android/gi).test(navigator.appVersion)){
            this.hasLongPage = true;
        }
        var origin = "50% 0%";
        if(dms.isPC()){
            origin = "0% 0%";
        }
        if(this.hasLongPage){
            this.$swiperContainer.css(
                {
                    "zoom" : scale,
                    "backface-visibility" : "hidden",
                    "-webkit-backface-visibility" : "hidden",
                    "-webkit-perspective" : 1000,
                    "perspective" : 1000
                });
        }else{
            this.$swiperContainer.css(
                {
                    "transform" : "translateZ(0) scale3d("+scale+","+scale+",1)",
                    "-webkit-transform" : "translateZ(0) scale3d("+scale+","+scale+",1)",
                    "transform-origin" : origin,
                    "-webkit-transform-origin" : origin,
                    "backface-visibility" : "hidden",
                    "-webkit-backface-visibility" : "hidden",
                    "-webkit-perspective" : 1000,
                    "perspective" : 1000
                });
        }
        this.$swiperContainer.attr("zoom-scale", scale);
        y = 0;
        var x = 0;
        y = ((stageHeight - height * scale) / 2);
        x = ((stageWidth - width * scale) / 2);

        this.$swiperContainer.css({
            top : (y) + "px",
            left : 0
//            left : x + "px"
        });
    };
    /**
     * 兼容之前的方法,获取评论容器
     * @param {index|number} 页序号
     */
    p.getPageCommentsParentDom = function(index){
        var self = this;
        var mm = self.magazineManager;
        if(!mm) return;
        var container = mm.getDomByIndex(index, self.bookIndex);
        var commentDom = $(container).find(".comment-discuss");
        return commentDom[0];
    };

    /**
     * 获取每页的所有数据对象
     * @param {i1|number}  页的序号
     * @param {i2|number}  组的序号
     */
    p.getPageDataObjects = function(i1){
        var self = this;
        var mm = self.magazineManager;
        if(!mm){
            return;
        }
        return mm.scriptParsers[self.bookIndex].getPageData()[i1];
    };
    /*********************
     *
     * 以下为创建动态组件
     *
     * **********************/
    /**
     * @description 创建视图控件
     */
    p.createViewPorts = function () {
        var self = this;
        var tapEvent = dms.getEventName();
        var viewPortsType = self._directoryType;      //1白色--单列， 2黑色--单列， 3白色--两列，4黑色--两列
        //根据不同的类型来决定，背景颜色和关闭按钮的颜色
        //TODO 关闭按钮 , 根据不同风格，设置黑白两种颜色的×
        var closeWhiteBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAAA4klEQVRYw8XVvQ3CMBBA4StDE8+TMiVsAIOGLAAdzJIBEI8CR7IimfjvDne+FO+TY8kiIgL0QCf/WIAD7sDVEgEcASdAB8x8lwkCOAMvYFoHZoggvgBD+EEdEY1bIHbjmojkuAYiO94SURxvgaiO1yCaxUsQzeM5CLV4CkI9HkHMfm8TjyAepvEN4ukRb2A0i3vAeuyEv8M6vgDj9k5Yxgc/60wQwCV24YCDKuJXXB2REldD5MSbI0rizRA18WpEi3gxomU8G6ERT0ZoxncRwMnqSQ0QN8CtQwdMVu+5R/QiIh+LtJ5ZeEclewAAAABJRU5ErkJggg==";
        var closeBlackBg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAABmJLR0QAAAAAAAD5Q7t/AAAACXBIWXMAAAsSAAALEgHS3X78AAABfUlEQVRYw72XrU4EMRCAvz0MnARXiSHBjkGRAHpB8iAEBwhA3APwGBjgLIvFrMKToO4NMIQfcd3kUrptp7e9uv1Jvy/T6XSKiOyLyIOIjFnhEJEtgDVjzB1QA3vGmPvZbPa1AvgO8GqM2RgBp0ADHAGPpSNh4Q1ggPXKvhwDT8Ah8Awct237WRh+27btZbXwsaiEDw5QOT8VkeiD/xMoIRGCewWGlIjBewWGkEiBBwWWkUiFA4xCE1lYjaJOOPCbEDwaAScSU+AgFAkP/Co2d5JAikQOXCUQksiFqwV6JM7tsxqeJeCR+GGezGo4RHZB37Brfwb82jnegUnOXFkCds2nzCP4AWyTeZSrBdyEA3aBFzL7Ce0u8Ga7kxMNUKeWbU0dCG61XInUSpi0z3MkogLaIqOViJ2GWRVOIxHqB7LLq0airyNaCq6R8PWEg8BTJdyueFB4isTivaAIPCbR3YyKwkMSlYhsAm+l4R6Jb+Cke3khItclwa5Ed2j9ARiWJT1Bbz2WAAAAAElFTkSuQmCC";
        var closeBg = viewPortsType % 2 != 0 ? closeBlackBg : closeWhiteBg;
        var commonBgColor = viewPortsType % 2 != 0 ? "rgb(238,238,238)" : "rgba(0,0,0, .5)";     //TODO 背景颜色需要透明度吗？
        var commonHintColor = viewPortsType % 2 != 0 ? "rgb(1,1,1)" : "rgb(255,255,255)";
        var commonTitleColor = viewPortsType % 2 != 0 ? "rgb(0,0,0)" : "rgb(255,254,254)";
        var commonBorder = viewPortsType % 2 != 0 ? "1px dashed #D2D2D2" : "1px solid rgba(204,204,204, .3)";
        var commonActiveClass = viewPortsType % 2 != 0 ? "item-white-view-port-li" : "item-black-view-port-li";

        //TODO 动态设置视图的显示属性
        this.viewPortDiv = document.createElement("div");
        var viewPortDivStyle = this.viewPortDiv.style;
        this.viewPortDiv.id = "view-port-wrap";
//        this.viewPortDiv.className = "view-port-style";
//        viewPortDivStyle.position = "absolute";
//        viewPortDivStyle.zIndex = "3";
//        viewPortDivStyle.width = "100%";
//        viewPortDivStyle.height = "100%";
//        viewPortDivStyle.top = "0";
//        viewPortDivStyle.left = "0";
//        viewPortDivStyle.paddingTop = "78px";
        viewPortDivStyle.background = commonBgColor;
//        viewPortDivStyle.overflow = "hidden";
//        viewPortDivStyle.display = "none";
        //目录头部容器
        var viewPortsTitleContainer = document.createElement("div");
        var viewPortsTitleContainerStyle = viewPortsTitleContainer.style;
        viewPortsTitleContainerStyle.position = "absolute";
        viewPortsTitleContainerStyle.zIndex = "2";
        viewPortsTitleContainerStyle.left = "0";
        viewPortsTitleContainerStyle.top = "0";
        viewPortsTitleContainerStyle.width = "100%";
        viewPortsTitleContainerStyle.height = "78px";
        viewPortsTitleContainerStyle.boxSizing = "border-box";
        viewPortsTitleContainerStyle.borderBottom = commonBorder;

        //关闭按钮
        var closeViewPorts = document.createElement("div");
        var closeViewPortsStyle = closeViewPorts.style;
        closeViewPortsStyle.position = "absolute";
        closeViewPortsStyle.right = "32px";
        closeViewPortsStyle.top = "19px";
        closeViewPortsStyle.width = "40px";
        closeViewPortsStyle.height = "40px";
        closeViewPortsStyle.background = "url('" + closeBg + "') center no-repeat";
        //目录提示
        var viewPortsHint = document.createElement("div");
        viewPortsHint.innerHTML = "目录";
        var viewPortsHintStyle = viewPortsHint.style;
        viewPortsHintStyle.position = "absolute";
        viewPortsHintStyle.left = "32px";
        viewPortsHintStyle.top = "0";
        viewPortsHintStyle.color = commonHintColor;
        viewPortsHintStyle.fontSize = "32px";
        viewPortsHintStyle.letterSpacing = "3.2px";
        viewPortsHintStyle.height = "78px";
        viewPortsHintStyle.lineHeight = "78px";
        this.createItemViewPorts(viewPortsType, commonTitleColor, commonBorder);
        viewPortsTitleContainer.appendChild(closeViewPorts);
        viewPortsTitleContainer.appendChild(viewPortsHint);
        this.viewPortDiv.appendChild(viewPortsTitleContainer);
        this.$swiperContainer.parent().append($(this.viewPortDiv));
        $(closeViewPorts).on(tapEvent, function (e) {
            e.stopPropagation();
            e.preventDefault();
            self.hideViewPorts();
        });
        var viewPortDivLi = $(this.viewPortDiv).find("li");
        viewPortDivLi.on(tapEvent, function (e) {
            e.stopPropagation();
            e.preventDefault();
            var target = e.target;
            var $target = $(e.target);
            var pageTo = $target.attr("page-to");
            for (var i = 0; i < viewPortDivLi.length; i++) {
                if (viewPortsType <= 2) {
                    $(viewPortDivLi[i]).removeClass(commonActiveClass);
                } else {
//                    $(viewPortDivLi[i]).find("img").removeClass("item-double-view-port-img");
                    $(viewPortDivLi[i]).find("div").removeClass("item-double-view-port-img");
                }
            }
            if (target.nodeName != 'LI') {
                $target = $target.parent();
            }
            if (viewPortsType <= 2) {
                $target.addClass(commonActiveClass);
            } else {
//                $target.find("img").addClass("item-double-view-port-img");
                $target.find("div").addClass("item-double-view-port-img");
            }

            if (pageTo) {
                pageTo = parseInt(pageTo);
//                console.log(pageTo, typeof(pageTo));
                //TODO 实现横向切页,点击目录切组
                if(pageTo == self.bookIndex){   //点击当前组的时候不执行,参照PCLady
//                    console.log("hahaha");
                }else{  //切换组,跳转到组的第一页,参照PCLady
                    self.pageTo(0, pageTo);
                }
                //隐藏目录
                self.hideViewPorts();
            }
        });
        //为了阻止在滑动目录的时候，swiper滑动下一页
        $(this.viewPortDiv).on("touchmove", function (e) {
            e.stopPropagation();
        });
    };
    /**
     * @description 动态生成视图元素的每个组件和组件的监听事件
     * @param {viewPortsType|number} 目录类型
     * @param {commonTitleColor|string} 标题的颜色
     * @param {commonBorder|string} 边框颜色
     */
    p.createItemViewPorts = function (viewPortsType, commonTitleColor, commonBorder) {
        var self = this;
        //TODO 创建作品的目录,组数据
        if(!self._tpl.hasOwnProperty("groups")) return;
        var data = self._tpl.groups;
        var viewPortUl = document.createElement("ul");
        //防止在pagesSwitch中阻止了touchmove 的默认事件
        viewPortUl.setAttribute("can-move", "ok");
        viewPortUl.setAttribute("data-bar", "cancel-scroll-bar");
        var viewPortUlStyle = viewPortUl.style;
        viewPortUlStyle.width = "100%";
        viewPortUlStyle.height = "100%";
        viewPortUlStyle.boxSizing = "border-box";
        viewPortUlStyle.overflowY = "auto";
        viewPortUlStyle.WebkitOverflowScrolling = "touch";
        //两列的情况
        if (viewPortsType > 2) {
            viewPortUlStyle.padding = "48px 6%";
        }
        var len = data.length;
        for (var i = 0; i < len; i++) {
            if(data[i].pages.length < 1 ){
                //TODO 可能第一大组没有作品
                continue;
            }
            var tempLi = document.createElement("li");
            //防止在pagesSwitch中阻止了touchmove 的默认事件
            tempLi.setAttribute("can-move", "ok");
            if (viewPortsType <= 2) {
                //只是单列的时候才能点击整个行
                tempLi.setAttribute("page-to", "" + i);
            }
            var tempLiStyle = tempLi.style;
            tempLiStyle.position = "relative";
            if (viewPortsType <= 2) {
                tempLiStyle.width = "100%";
                tempLiStyle.height = "292px";
                tempLiStyle.padding = "16px 32px";
            } else {
                tempLiStyle.width = "50%";
                tempLiStyle.height = "366px";
                tempLiStyle.textAlign = "center";
                tempLiStyle.float = "left";
            }
            //只是白色单列的时候才是所有的列都有顶部边框
            if (viewPortsType == 1 && i != len) {
                tempLiStyle.borderBottom = commonBorder;
            }
            tempLiStyle.listStyleType = "none";
            tempLiStyle.boxSizing = "border-box";
	        var tempDiv = document.createElement("div");
            var tempDivStyle = tempDiv.style;
            //防止在pagesSwitch中阻止了touchmove 的默认事件
            tempDiv.setAttribute("can-move", "ok");
            tempDiv.setAttribute("page-to", "" + i);
            tempDivStyle.width = "170px";
            tempDivStyle.height = "260px";
            tempDivStyle.overflow = "hidden";
            tempDivStyle.display = "inline-block";
            tempDivStyle.boxSizing = "border-box";
            if (viewPortsType <= 2) {
                tempDivStyle.verticalAlign = "middle"
            }

            var tempImg = document.createElement("img");
            //防止在pagesSwitch中阻止了touchmove 的默认事件
            tempImg.setAttribute("can-move", "ok");
            tempImg.setAttribute("page-to", "" + i);
            tempImg.src = data[i].f_cover + "?imageView2/2/w/170";
            var tempImgStyle = tempImg.style;
            tempImgStyle.width = "170px";
//            tempImgStyle.height = "260px";
            tempImgStyle.boxSizing = "border-box";
            //表示文字
            var tempSpan = document.createElement("span");
            //防止在pagesSwitch中阻止了touchmove 的默认事件
            tempSpan.setAttribute("can-move", "ok");
            tempSpan.setAttribute("page-to", "" + i);
            tempSpan.innerHTML = data[i].f_name;
            var tempSpanStyle = tempSpan.style;
            tempSpanStyle.display = "inline-block";
            tempSpanStyle.boxSizing = "border-box";
            if (viewPortsType <= 2) {
                tempSpanStyle.width = "calc(100% - 170px)";
                tempSpanStyle.width = "-webkit-calc(100% - 170px)";
                tempSpanStyle.fontSize = "32px";
                tempSpanStyle.paddingLeft = "32px";
//                tempSpanStyle.height = "260px";
//                tempSpanStyle.lineHeight = "260px";
                tempSpanStyle.textOverflow = "ellipsis";
                tempSpanStyle.overflow = "hidden";
                tempSpanStyle.whiteSpace = "nowrap";
            } else {
                tempSpanStyle.width = "100%";
                tempSpanStyle.height = "64px";
                tempSpanStyle.fontSize = "28px";
                tempSpanStyle.lineHeight = "36px";
                tempSpanStyle.textAlign = "center";
                tempSpanStyle.marginTop = "16px"
                tempSpanStyle.whiteSpace = "pre-wrap";
            }
            tempSpanStyle.color = commonTitleColor;

            tempDiv.appendChild(tempImg);
            tempLi.appendChild(tempDiv);
//	        tempLi.appendChild(tempImg);
            tempLi.appendChild(tempSpan);
            viewPortUl.appendChild(tempLi);
        }
        if (this.viewPortDiv) {
            this.viewPortDiv.appendChild(viewPortUl);
        }
    };
    /**
     * @description 显示视图控件
     * @param {domArr|array}        dom对象的数组
     * @param {className|string}    设置的选中样式
     */
    p.setViewPortsItemSelect = function (domArr, className) {
        var self = this;
        var liLen = domArr.length;
        for (var i = 0; i < liLen; i++) {
            domArr[i].className = "";
            if (i == self.bookIndex) {
                domArr[i].className = className;
            }
        }
    },
    /**
     * @description 显示视图控件
     */
    p.showViewPorts = function () {
        var self = this;
        if (!self.viewPortDiv) {
            self.createViewPorts();
        }
        if (self.viewPortDiv) {
            var currentTop = 0;
            var viewPortLi = $(self.viewPortDiv).find("li");
            //TODO 这里的获取li的高度
            var itemHeight = viewPortLi.outerHeight() || 0;
            if (self._directoryType <= 2) {
                var className = "";
                //白色单列"item-white-view-port-li" : "item-black-view-port-li";
                if (self._directoryType == 1) {
                    className = "item-white-view-port-li";
                } else {  //黑色单列
                    className = "item-black-view-port-li";
                }
                currentTop = itemHeight*self.bookIndex;
                self.setViewPortsItemSelect(viewPortLi, className);
            } else {
                var viewPortImg = $(self.viewPortDiv).find("div");
//		        var viewPortImg = $(self.viewPortDiv).find("img");
                self.setViewPortsItemSelect(viewPortImg, "item-double-view-port-img");
                //双排显示的时候
                currentTop = itemHeight*(self.bookIndex / 2);
            }


            //TODO 目录 出现方式，上下出现方式，左右出现方式
            self.viewPortDiv.style.display = "block";
            //设置滚动到某个高度
            ($(self.viewPortDiv).find("ul")).scrollTop(currentTop);
            self.viewPortDiv.className = "slideInFromBottom";
            $(self.viewPortDiv).on("webkitAnimationEnd",function(){
                self.viewPortDiv.className = "";
                $(self.viewPortDiv).off("webkitAnimationEnd");
                self.$wrapper[0].style.filter = "blur(24px)";
                self.$wrapper[0].style.WebkitFilter = "blur(24px)";
            });
        }
    };
    /**
     * @description 隐藏视图控件
     */
    p.hideViewPorts = function () {
        var self = this;
        if (self.viewPortDiv) {
            //TODO 目录隐藏的方式，上下隐藏方式，左右隐藏方式
            self.$wrapper[0].style.filter = "";
            self.$wrapper[0].style.WebkitFilter = "";
            self.viewPortDiv.className = "slideOutToBottom";
            $(self.viewPortDiv).on("webkitAnimationEnd",function(){
                self.viewPortDiv.style.display = "none";
                self.viewPortDiv.className = "";
                $(self.viewPortDiv).off("webkitAnimationEnd");
            });
        }
    };
    /**
     * @description 创建页码组件
     * @param {data|object} 页码组件的数据对象
     */
    p.createPageNumWidget = function (data, currentPage, pageLength) {
        var self = this;
        if(!self._pageNumType){
            return;
        }
        data = data || {};
        var color = data.color || "#000";
        var fontSize = data.fontSize || 20;
        var right = data.right || 16;
        var bottom = data.bottom || 16;
        var showWay = self._pageNumType;    //显示方式，1， 表示垂直， 2表示水平
        var defaultWidth = showWay == 1 ? 26 : 80;      //定义横竖显示的宽度
        var width = data.width || defaultWidth;
        var height = data.height || 52;
        //TODO 根据计算页码的方式不一样，呈现的页码内容不一
        var countWay = data.countWay || 1;  //计算页码的方式， 0，表示所有页是计算方式， 1，表示大组的计算方式
        //add by fishYu 2016-5-4 14:55 为了在iphone6以上的分辨率手机能呈现增加一个容器
        self.pageNumWrap = document.createElement("div");
        var pageNumWrapStyle = self.pageNumWrap.style;
        pageNumWrapStyle.position = "absolute";
        pageNumWrapStyle.zIndex = "3";
        pageNumWrapStyle.width = "300px";
        pageNumWrapStyle.height = "300px";
        pageNumWrapStyle.right = right + "px";
        pageNumWrapStyle.bottom = bottom + "px";
        pageNumWrapStyle.pointerEvents = "none";
        //创建页码父容器
        self.pageNumDiv = document.createElement("div");
        var pageNumDivStyle = this.pageNumDiv.style;
        pageNumDivStyle.position = "absolute";
        pageNumDivStyle.zIndex = "2";
        pageNumDivStyle.width = width + "px";
        pageNumDivStyle.height = height + "px";
        //TODO 第一组需要隐藏页码组件的情况 ,有可能是undefined
        if(self.initPageNumStatus == false){
            pageNumDivStyle.display = "none";
        }
        pageNumDivStyle.right = "0";
        pageNumDivStyle.bottom = '0';
        pageNumDivStyle.fontSize = fontSize + "px";
        pageNumDivStyle.textAlign = "center";
//        pageNumDivStyle.pointerEvents = "none";
        pageNumDivStyle.color = color;
        pageNumDivStyle.background = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAFCAYAAACXU8ZrAAAAKUlEQVQImWN8JGv0n4EAYGJgYGAkoIaRCcbApQBmEgMOhXA+Ew4JFA0AlasCQnZiwRYAAAAASUVORK5CYII=') bottom center no-repeat";
        var curPageNum = document.createElement("div");     //当前页
        curPageNum.id = "cur-page-num";
        curPageNum.innerHTML = currentPage + 1;    //当前页数值+1
        var divideLine = document.createElement("div");    //分割线
        divideLine.id = "page-num-line";
        if (showWay == 2) {   //水平显示的时候设置样式
            divideLine.innerHTML = "/";
//            pageNumDivStyle.padding = "0 2%";

            pageNumDivStyle.lineHeight = height + "px";
            pageNumDivStyle.WebkitColumnCount = "3";
            pageNumDivStyle.MozColumnCount = "3";
            pageNumDivStyle.OColumnCount = "3";
            pageNumDivStyle.MsColumnCount = "3";
            pageNumDivStyle.columnCount = "3";
            pageNumDivStyle.WebkitColumnGap = "0";
            pageNumDivStyle.MozColumnGap = "0";
            pageNumDivStyle.OColumnGap = "0";
            pageNumDivStyle.MsColumnGap = "0";
            pageNumDivStyle.columnGap = "0";
        } else if (showWay == 1) {  //垂直显示的时候设置样式
            divideLine.innerHTML = pageLength >= 10 ? "—" : "-";  //"—"  "-"       总页数大于10页的时候"—" ，小于10的时候"-"
            divideLine.style.lineHeight = "0";
            //modify by fish 2016-5-6 11:51 在pc端的时候缩放后的字号小于12px默认为12px，
            if(dms.isPC()){
                pageNumDivStyle.height = (height + 12) +"px";
            }else{
                pageNumDivStyle.height = (height + 4) +"px";
            }
            divideLine.style.margin = "2px auto";
            pageNumDivStyle.WebkitColumnCount = "1";
            pageNumDivStyle.MozColumnCount = "1";
            pageNumDivStyle.OColumnCount = "1";
            pageNumDivStyle.MsColumnCount = "1";
            pageNumDivStyle.columnCount = "1";
        }
        var allPageNum = document.createElement("div");    //总页码
        allPageNum.id = "all-page-num";
        allPageNum.innerHTML = pageLength;     //总页数值
        self.pageNumDiv.appendChild(curPageNum);
        self.pageNumDiv.appendChild(divideLine);
        self.pageNumDiv.appendChild(allPageNum);
        self.pageNumWrap.appendChild(self.pageNumDiv);
        var container = self.$swiperContainer[0];
        self.$swiperContainer[0].appendChild(self.pageNumWrap);
//        container.insertBefore(self.pageNumDiv,container.firstChild);


    };
    /**
     * @description 重新设置页码数
     * @param {curNum|number} 当前页码
     * @param {allNum|number} 总页码
     */
    p.resetPageNumWidgetContent = function (curNum, allNum) {
        var self = this
        if (!self.pageNumDiv || !self._pageNumType) return;
        allNum = allNum || self.pageLength;
        var $pageNum = $(self.pageNumDiv);
        var curPage = $pageNum.find("#cur-page-num");
        var allPage = $pageNum.find("#all-page-num");
        if(self._pageNumType == 1){   //垂直方向的时候
            var pageLine = $pageNum.find("#page-num-line");
            var lineContent = allNum >= 10 ? "—" : "-";  //"—"  "-"       总页数大于10页的时候"—" ，小于10的时候"-"
            pageLine.text(lineContent);
        }
        curPage.text(curNum);
        allPage.text(allNum);
    };
    /**
     * 关闭其他非当前页的音频
     * @param data
     */
    p.pauseOtherAudios = function(data){
        if(this.$wrapper){
            var otherAudios = this.$wrapper.find("*[play-status='play-normal']");
            if(otherAudios.length > 0){
                for(var i = 0; i < otherAudios.length; i++){
                    otherAudios[i].pause();
                    otherAudios[i].parentNode.style.background = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAMAAADOixOHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABGlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAACz+Fa2AAAAXHRSTlMAhHeK/mmR+jxx5RSHnwO2OwYW674Hs6QBXjkKuHUC05z4JVryCEb8qO1CgP0dg+R0X359MdlKEfDJDn/P+1ISeD3d2qlkF2Kmha4QDESBCekNBNxNbMXAP5ahFZTSyTUAAAABYktHRACIBR1IAAAACXBIWXMAAAsSAAALEgHS3X78AAABLklEQVQoz22S11bDMBAFBYgaIISShBaaTTMh9G7A9FBC7/v/38G9CvKxj6wHa3ZWWq8lK5UeLa0qa7SJbs/QHSLS2eX6bnjpybmJXib6XN+fh9cDSVUo8Dk4hMRwQo8US2XOo6w0FuvxCZFJQmUKfjr2rDszS5oDeb718wsIF0n+Emg53hAgWqmSSqDV2Ps1hGukdUAR80bzqDYR5glbgG1o0Ts2rBF2AXtm2T7DAzZudvKT1SGeRyYMQeyvYjwS+pg6hzAknJg6SJya5RHCM/ui8/SdXBAu//tsjisP4TXpBlC3unzLY7kD3XPBg/UNdtmwZbzH5PE8PQNeXtM3GYh+4/zOjVHiwgLTbpXVP9x7/+THfjn+m1V+HF03/9Wv49lVGCmVlcj6b21XSv0Br5lN9OvlDGIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDEtMjBUMTQ6NDE6NTcrMDg6MDBBCJ6JAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTAxLTIwVDE0OjQxOjU3KzA4OjAwMFUmNQAAAABJRU5ErkJggg==") no-repeat center rgba(0,0,0,.5)';
                    //modify by fishYu 2016-3-音频暂停的时候显示播放动画
//                    console.log($(otherAudios[i]).siblings());
                    if($(otherAudios[i]) && $(otherAudios[i]).siblings){
                        $(otherAudios[i]).siblings().show();
                    }
                }
            }
        }
    };
    /**
     * 关闭当前正在播放的音频
     * @param data
     */
    p.pausePlayAudio = function(data){
        if(this.$wrapper){
            var playAudio = this.$wrapper.find("*[play-status='play-current']");
            if(playAudio.length > 0){
                playAudio[0].pause();
                playAudio[0].setAttribute("play-status", "play-normal");
                playAudio[0].parentNode.style.background = 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAgCAMAAADOixOHAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAABGlBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAACz+Fa2AAAAXHRSTlMAhHeK/mmR+jxx5RSHnwO2OwYW674Hs6QBXjkKuHUC05z4JVryCEb8qO1CgP0dg+R0X359MdlKEfDJDn/P+1ISeD3d2qlkF2Kmha4QDESBCekNBNxNbMXAP5ahFZTSyTUAAAABYktHRACIBR1IAAAACXBIWXMAAAsSAAALEgHS3X78AAABLklEQVQoz22S11bDMBAFBYgaIISShBaaTTMh9G7A9FBC7/v/38G9CvKxj6wHa3ZWWq8lK5UeLa0qa7SJbs/QHSLS2eX6bnjpybmJXib6XN+fh9cDSVUo8Dk4hMRwQo8US2XOo6w0FuvxCZFJQmUKfjr2rDszS5oDeb718wsIF0n+Emg53hAgWqmSSqDV2Ps1hGukdUAR80bzqDYR5glbgG1o0Ts2rBF2AXtm2T7DAzZudvKT1SGeRyYMQeyvYjwS+pg6hzAknJg6SJya5RHCM/ui8/SdXBAu//tsjisP4TXpBlC3unzLY7kD3XPBg/UNdtmwZbzH5PE8PQNeXtM3GYh+4/zOjVHiwgLTbpXVP9x7/+THfjn+m1V+HF03/9Wv49lVGCmVlcj6b21XSv0Br5lN9OvlDGIAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTYtMDEtMjBUMTQ6NDE6NTcrMDg6MDBBCJ6JAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTAxLTIwVDE0OjQxOjU3KzA4OjAwMFUmNQAAAABJRU5ErkJggg==") no-repeat center rgba(0,0,0,.5)';
                //音频暂停的时候显示播放动画
//                console.log($(playAudio[0]).siblings());
                if($(playAudio[0]) && $(playAudio[0]).siblings){
                    $(playAudio[0]).siblings().show();
                }
            }
        }

        //关闭非正在播放当前的视频
        if(this.$wrapper){
            var otherVideos = this.$wrapper.find("*[play-video-status='play-normal']");
            if(otherVideos.length > 0){
                for(var i = 0; i < otherVideos.length; i++){
                    otherVideos[i].pause();
                }
            }
        }

    };
    /**
     * 用于判断是否还有下一组
     */
    p.hasNextGroup = function(){
        return this.bookIndex < this.tplsLength - 1;
    };
    /**
     * 用于判断是否还有下一页
     */
    p.hasNextPag = function() {
        return this.pageIndex < this.pageLength - 1;
    };
    /**
     *跳转到下一组
     */
    p.nextGroup = function() {
        if (this.hasNextGroup()) {
            //todo 如果该组锁定的时候停止播放
            var status = this.getGroupFreezeStatus(this.bookIndex);
            if (status){
                this.pauseMagazine();
            } else {
                this.pageTo(0, this.bookIndex + 1);
            }
        }
    };
    /**
     * 跳转到下一页
     */
    p.nextPage = function() {
        if (this.hasNextPag()) {
            //todo 如果该页锁定的时候停止播放
            if(!this.scriptParser){
                return;
            }
            var pageAnimation = this.scriptParser.getPageAnimation(this.pageIndex);//- this._offset
            var pageLock = false;
            if(pageAnimation && pageAnimation.hasOwnProperty("lock")){
                pageLock = pageAnimation.lock;
            }
            if (pageLock){
                this.pauseMagazine();
            } else {
                this.pageTo(this.pageIndex + 1, this.bookIndex);
            }
        } else if (this.hasNextGroup()) {
            this.nextGroup();
        }
    };
    /**
     * 自动播放微杂志
     */
    p.playMagazine = function(){
        var self = this;
        // todo modify by fishYu 2016-5-8 12:19 修改增加按照每页的延迟时间来播放
        if(!self.scriptParser){
            return;
        }
        self.magazinePlaying = true;
        var pageAnimation = self.scriptParser.getPageAnimation(self.currentPage );//- this._offset
//        var inter = self._animationMode.interval;
        if(pageAnimation){
            self._animationMode.interval = pageAnimation.interval
        }
        self.playMagazineHandle();
    };
    /**
     * 自动播放的实时执行函数
     */
    p.playMagazineHandle = function(){
        var self = this;
        self.playTimer = setTimeout(function(){
            if(!self.scriptParser){
                return;
            }
            var pageAnimation = self.scriptParser.getPageAnimation(self.currentPage+1);//- this._offset
            if(pageAnimation){
                self._animationMode.interval = pageAnimation.interval
            } else {
                self._animationMode.interval = self.defaultInterval;      //TODO 默认10s
            }
            if(self.magazinePlaying){
                if(self.hasNextPag()){
                    self.nextPage();
                }else if(self.hasNextGroup()){
                    self.nextGroup();
                }else{
                    //自动轮播尾页的时候跳到起始页
                    self.pageTo(0, 0);
//                    return;
                }
            }
            self.playMagazineHandle();
        }, self._animationMode.interval);
    };
    /**
     * 暂停自动播放微杂志
     */
    p.pauseMagazine = function(){
        var self = this;
        self.magazinePlaying = false;
        if(self.playTimer){
            window.clearTimeout(self.playTimer);
        }
    };
    /**
     * 清空全局组件
     */
    p.clearGlobalComponent = function(){
        var self = this;
        //清除页码
        if(self.pageNumWrap){
            self.$swiperContainer[0].removeChild(self.pageNumWrap);
            self.pageNumWrap = null;
        }
        //清楚目录
        if(self.viewPortDiv){
            $(self.viewPortDiv).remove();
            self.$wrapper[0].style.filter = "";
            self.$wrapper[0].style.WebkitFilter = "";
            self.viewPortDiv = null;
        }
    };
    /**
     * 改变组
     */
    p.changeGroupPageNumStatus = function(){
        //1、获取大组里面的控制显示隐藏页面组件的标志
        var self = this;
        if(!self._tpl.hasOwnProperty("groups")) return;
        var tempGroup= (self._tpl.groups)[self.bookIndex];
        var pageNumStatus = tempGroup.show_page_num;    //默认为true;有可能是undefined
        if(pageNumStatus == false){
            self.hidePageNum();
        }else{
            self.showPageNum();
        }
    };
    /**
     * 隐藏页码组件
     */
    p.hidePageNum = function(){
        var self = this;
        if(self.pageNumDiv){
            self.pageNumDiv.style.display = "none";
        }
    };
    /**
     * 显示页码组件
     */
    p.showPageNum = function(){
        var self = this;
        if(self.pageNumDiv){
            self.pageNumDiv.style.display = "block";
        }
    };
    /**
     *按照组的序号获取组是否锁定的状态
     */
    p.getGroupFreezeStatus = function (bookIndex) {
        var self = this;
        //TODO 创建作品的目录,组数据
        if(!self._tpl.hasOwnProperty("groups")) return false;
        var groups = self._tpl.groups;
        //f_slip_status获取组的是否禁止翻组的开关字段
        return groups[bookIndex].f_slip_status;
    };
    dms.MagazineDisplay2 = MagazineDisplay;
})(dms);