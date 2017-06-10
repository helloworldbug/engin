// 文件名称: MagazineManager
//
// 创 建 人: chenshy
// 创建日期: 2016/3/21 11:19
// 描    述: MagazineManager
(function(dms){

    //加载页面新模版
    var loadingTpl = [
        '<div class="magazine-display-loading">',
        '</div>'
    ];

    loadingTpl = loadingTpl.join("");
    var pageContainerTpl = "<div class=\"magazine-page-container hide\"></div>";

    // data-page-animation='{1}' animation-direction='{2}' data-page-index='{0}'

    var commentTpl = "<div class=\"comment-discuss pointerEventsClose\"  data-type=\"me-comments\"></div>";

    /**页模板**/
    var htmlTpl = "<div>" +
//        loadingTpl +
//        pageContainerTpl +
        commentTpl +
        "</div>";
    /**
     * 获取组之内的所有页的数据集合
     * @param {arr|array}       需要合并页数据的组集合
     * @param {field|string}    对应的获取页数据字段
     * @returns {Array}         返回组之内的所有页的数据集合
     */
    function getPages(arr, field){
        var result = [], obj;
        for(var i =0; i<arr.length; i++){
            obj = arr[i];
            if(!obj.hasOwnProperty(field)){
                result.push(obj);
            }else{
                var tmp = getPages(obj[field], field);
                result = result.concat(tmp);
            }
        }
        return result;
    }
    /**
     * 只是一个组嵌组的重嵌套的解析
     * @param {obj|object}       需要合并页数据的组集合
     * @param {field|string}    对应的获取页数据字段
     * @isOneDimensional {field|number}    对应的表示多维作品呈现是一维还是二维的
     * @returns {Array}         返回合并之后的一级组数据集合
     */
    function parseInnerGroup (obj, field, isOneDimensional){
//        var newArr = [];
        var tplArr = [];
        var pagesArr = [];
        //对象改变值的时候需要克隆一个对象出来。
        var tempTpl = dms.cloneJSONObject(obj);
        tempTpl.groups = null;
        var groups = obj.groups;
        for(var i = 0; i < groups.length; i++){
            var groupObj = groups[i];
            var pages = groupObj[field];
            //过滤第一大组的空组
            if(pages.length < 1){
                continue;
            }
            var groupPages = getPages(pages, field);
//            groupObj[field] = groupPages;
//            newArr.push(groupObj);
            //拼凑tpl数组
            //对象改变值的时候需要克隆一个对象出来。
            if(groupPages.length < 1){
                continue;
            } else {
                if (!isOneDimensional){    //表示二维的时候
                    var tempTplClone = dms.cloneJSONObject(tempTpl);
                    tempTplClone.page_value = groupPages;
                    tplArr.push(tempTplClone);
                } else {        //表示一维的时候
                    pagesArr = pagesArr.concat(groupPages);
                    if (i == groups.length - 1){
                        var tempTplClone = dms.cloneJSONObject(tempTpl);
                        tempTplClone.page_value = pagesArr;
                        tplArr.push(tempTplClone);
                    }
                }
            }

        }
        //拼凑tpl数组
//        for(var j = 0; j < newArr.length; j++){
//            //对象改变值的时候需要克隆一个对象出来。
//            var tempTplClone = dms.cloneJSONObject(tempTpl);
//            tempTplClone.page_value = newArr[j].pages;
//            tplArr.push(tempTplClone);
//        }
        return tplArr;

    }

    //构建多刊数据，以前的单刊也支持
    function getTpls(tpl){
        //return [tpl];
//        return [_tpl1,_tpl2,_tpl3,_tpl4];
        var tplFlag = tpl.tpl_sign;
        if(tplFlag == 2){   //ME期刊的情况
            //TODO 把所有的一级以下的组中的页合并到一级组中,然后把一级组拼成作品的数组
            return parseInnerGroup(tpl, "pages");
            // return parseInnerGroup(tpl, "pages", true);      //根据字段来判断是否是一维呈现,多维的默认是二维呈现, 后期规划
        }else{
            return [tpl];
        }

    }

    function getScriptParsers(tpls){
        var arr = [];

        for(var i = 0;i < tpls.length;i++){
            arr.push(new dms.ScriptParser(tpls[i]));
        }

        return arr;
    }

    function create2Arr(doms,tpls){
        for(var i = 0;i < tpls.length;i++){
            doms[i] = [];
        }
    }

    function readyTimeline(objects){
        objects.forEach(function(o){
            o.readyToTimeline();
        });
    }

    var MagazineManager = function(tpl,$c){
        //this.tpl = tpl;
        this.tpl = tpl;
        this._tplClass = tpl.tpl_class || 0;
        this._lastStatus = tpl.last_status || 0;
        this.tpls = getTpls(tpl);
        //自定义组的长度
        this._groupsLength = this.tpls.length;
        this.scriptParsers = getScriptParsers(this.tpls);

        this.$container = $c;


        this.pageContainers = [];
        this._created = [];
        this._symbols = [];
        this._symbolInit = [];
        /**标识自定义添加页**/
        this._addArr = [];

        this.id = dms.getNewID();

        this.pagePrefix = "page_" + this.id + "_";

        create2Arr(this.pageContainers,this.tpls);
        create2Arr(this._created,this.tpls);
        create2Arr(this._symbols,this.tpls);
        create2Arr(this._symbolInit,this.tpls);
        create2Arr(this._addArr,this.tpls);
    };

    var p = MagazineManager.prototype;

    /**
     * 生成所有页对象，加入dom容器并返回
     * @param i1 页
     * @param i2 章
     * @isAddListener 是否重新添加事件
     */
    p.getDomByIndex = function(i1,i2,isAddListener){
        i2 = i2 || 0;
        var doms = this.pageContainers[i2];

        if(!doms){
            return null;
        }

        //var scriptParser = this.scriptParsers[i2];
        return this.createPage(i1,i2, isAddListener);

        //console.log(doms);
        //return doms[i1];
    };

    p.getPageId = function(i1,i2){
        i2 = i2 || 0;
        return this.pagePrefix + i2 + "-" + i1;
    };

    p.createPage = function(i1,i2, isAddListener){
        i2 = i2 || 0;
        var self = this;

        var len = self.pageContainers.length;
        i2 = mUtils.limitNum(i2,len);

        var scriptParser = this.scriptParsers[i2];

        var pageLength = scriptParser.pageLength;
        i1 = mUtils.limitNum(i1,pageLength);

        if(!this._created[i2][i1]){
            this._createContainerAndObjects(i1,i2);
        }
        //modify by fishYu 2016-4-26 19:39 更改最后插入的一页的dom
        var currentPage ;
        if(typeof(this.pageContainers[i2][i1]) == "string"){
            currentPage = this.pageContainers[i2][i1];
        }else{
            currentPage = this.pageContainers[i2][i1].element;
        }
        if(isAddListener){
            //modify by fishYu 2016-4-26 16:41修改事件丢失的问题
            var currentPageObjects = this.pageContainers[i2][i1].children; //尾页的时候不是object
            if(currentPageObjects){
                for(var i = 0; i <currentPageObjects.length; i++ ){
                    var obj = currentPageObjects[i];
                    if(obj){
                        obj.addListener && obj.addListener();
                        obj.resetAnimation && obj.resetAnimation();   //回翻的时候重置动画 modify by fishYu 2016-8-19 9:23
                    }
                }
            }
        }
        return currentPage;
    };

    p._createContainerAndObjects = function(i1,i2){
        var currentPageContainer,objects;
        currentPageContainer = this.createPageContainer(i1,i2);
        var scriptParser = this.scriptParsers[i2];
        /**获取元素显示对象**/
        if(!scriptParser) return;

        objects = scriptParser.getPageByIndex(i1);
        if(objects.length > 0){

            this._created[i2][i1] = true;
            currentPageContainer.element.id = this.getPageId(i1,i2);

            $(currentPageContainer.element).attr("data-type","stage");
            //TODO 作品内容是否轮播，设置开关,或者对组动态设置
            //add by fishYu 2016-4-22 11:08 增加判断是否是第几组的第一页，和最后一页
            if (i1 == 0) {
                if (!dms.IS_LOOP_PLAY || this._groupsLength > 1) { //控制属否循环播放
                    $(currentPageContainer.element).attr("first-page", "yes");
                }    
            }
            var currentGroupPageLength = this.getPageLength(i2);
            if(i1 == currentGroupPageLength - 1){
                //modify by fishYu 2016-4-28 14:13 修改是个人版并且是最后一组的时候，不设置该属性，因为追加了尾页
                if(this._lastStatus == 0 && i2 == (this.scriptParsers.length -1 )){ //有尾页的时候
                    var locHref = window.location.href;
                    //TODO 这里在预览的单页时候不添加尾页，所以得另外判断,在APP预览的时候，PC端预览，PC浏览的时候
                    if(this._tplClass == 0){    //个人作品
                        if(locHref.indexOf("#mz/magazine/preview") > -1 || locHref.indexOf("display_engine") > -1
                            || locHref.indexOf("/makePreview") > -1 || locHref.indexOf("/preview") > -1) {   //
                            if (!dms.IS_LOOP_PLAY || this._groupsLength > 1) { //控制属否循环播放
                                $(currentPageContainer.element).attr("last-page", "yes");
                            }    
                        }else{  //有尾页在，自定义尾页上添加
                            //console.log("hehe");
                        }
                    } else {  //企业作品
                        if (!dms.IS_LOOP_PLAY || this._groupsLength > 1) { //控制属否循环播放
                            $(currentPageContainer.element).attr("last-page", "yes");
                        }    
                    }
                } else {  //无尾页的时候，在最后一页上添加last-page 属性
                    if (!dms.IS_LOOP_PLAY || this._groupsLength > 1) { //控制属否循环播放
                        $(currentPageContainer.element).attr("last-page", "yes");
                    }
                }
            }

            this._addDisplayObjectsToContainer(objects,currentPageContainer);

            this._createSymbol(i1,i2);
            this._initSymbol(i1,i2);

            Cyan.okToLaunchComposition(this.getPageId(i1,i2));

            readyTimeline(objects);
        }
//        this.pageContainers[i2][i1] = currentPageContainer.element;
        //modify by fishYu 2016-4-26 16:41修改事件丢失的问题
        this.pageContainers[i2][i1] = currentPageContainer;
        //return currentPageContainer;
    };

    /**
     * 将元素对象添加到容器
     * @private
     **/
    p._addDisplayObjectsToContainer = function(objects,container){
        var len = objects.length;
        container.addChildren(objects);

        for(var i = 0;i < len;i++){
            //TODO 时间轴 stage
            objects[i].stage = this.$container;
            //objects[i].userObject = {
            //    compPrefix : this.pagePrefix,
            //    magazineDisplay : this
            //};
            //container.addChild(objects[i]);
            objects[i].resetAttribute();
        }
    };

    p.getPageLength = function(i2){
        if(this.scriptParsers[i2]){
            return this.scriptParsers[i2].pageLength;
        }
        return 0;
    };
    /**
     * 获取新的ME期刊中所有页的总和
     * @returns {number}
     */
    p.getAllPagesLength = function(){
        var len = 0;
        var spLength = this.scriptParsers.length
        if(this.scriptParsers && spLength > 0){
            for(var i = 0; i < spLength; i++){
                len += this.getPageLength(i);
            }
        }
        return len;
    };
    p.limitPage = function(i1,i2){
        if(this.scriptParsers[i2]){
            var len = this.scriptParsers[i2].pageLength;
            var page = mUtils.limitNum(i1,len);
            return page;
        }
        return -1;
    };

    p.limitBookIndex = function(i2){
        return mUtils.limitNum(i2,this.tpls.length);
    };

    p._createSymbol = function(i1,i2){
        if(this._symbols[i2][this.pagePrefix + i1]){
            return;
        }

        var page = {};
        var timelines = page.timelines = {};
        page.gpuAccelerate = false;
        //获取index页的所有显示对象
        var objects = this._getPageObjects(i1,i2);
        var i,len = objects.length,obj;
        var hasAnimation = false;
        var symbol;


        //查找显示对象中是否有timeline动画
        for(i = 0; i < len; i++){
            obj = objects[i];

            if(symbol = obj._cyanAnimationScript){
                var timelineName = "timeline_" + obj.uid;
                timelines[timelineName] = symbol;
                hasAnimation = true;
            }
        }

        if(hasAnimation){
            this._symbols[i2][this.pagePrefix + i1] = {};
            this._symbols[i2][this.pagePrefix + i1]["stage"] = page;
        }
    };

    p._initSymbol = function(i1,i2){
        var symbol;
        if((symbol = this._symbols[i2][this.pagePrefix + i1]) && !this._symbolInit[i2][this.pagePrefix + i1]){
            var compId = this.pagePrefix + i1;
            this._symbolInit[i2][compId] = true;
            Cyan.registerCompositionDefn(compId,symbol);
        }
    };

    p._getPageObjects = function(i1,i2){
        i2 = i2 || 0;
        var scriptParser = this.scriptParsers[i2];

        /**获取元素显示对象**/
        return scriptParser.getPageByIndex(i1);
    };

    /**
     * 创建页容器
     * @returns {*}
     */
    p.createPageContainer = function(i1,i2){
        i2 = i2 || 0;
        var scriptParser = this.scriptParsers[i2];
        var dom = $(htmlTpl);
        var c = dom.get(0);
        var agileContainer = new dms.Container(c);
        //TODO add by fishYu 2016-4-25 9:22 添加一个默认白色背景色
        var bgColor = scriptParser.getPageBackgroundColors()[i1] || "#fff";
        var bgImage = scriptParser.getPageBackgroundImages()[i1];

        if(bgColor){
            agileContainer.backgroundColor = bgColor;
        }

        if(bgImage){
            agileContainer.backgroundImage = bgImage;
            agileContainer.element.style.backgroundRepeat = "repeat";
            agileContainer.element.style.backgroundPosition = "center";
        }

        var pageSize = scriptParser.getPageSizes()[i1];
        //this._scriptParser.getPageSizes()[index] = [2000,2000];

        //var a_height = 2000;
        agileContainer.width = pageSize[0];
        agileContainer.height = pageSize[1];
        c.setAttribute("data-height",pageSize[1]);
        if(pageSize[1] > 1008){
            c.setAttribute("page-type","long-page");

            //添加长页滚动条
            var scrollBar = document.createElement("div");
            scrollBar.id = "scrollBar";
            $(scrollBar).css({
                "position": "absolute",
                //"background": "rgba(0,0,0,0.5)",
                "height": "200px",
                "width": "500px",
                "top": "0px",
                "right": "6px",
                "z-index": "999",
                "border-radius": "4px",
                "transition": "opacity 800ms",
                "opacity": "0",
                "pointer-events": "none"
            });
            c.appendChild(scrollBar);
        }
        //TODO 做一个判断只是在android 并且在qq有长页的情况下
        //if(this.userAgent.indexOf("qq/") > -1 && pageSize[1] > 1008 && (/android/gi).test(navigator.appVersion)){
        //    this.hasLongPage = true;
        //}

        agileContainer.element.style.border = "none";
        agileContainer.element.style.overflow = "hidden";
        var temp1 = document.createElement("div");
        temp1.appendChild( agileContainer.element);
        temp1.appendChild( agileContainer.element);
        //TODO 追加endPAG
        return agileContainer;
    };

    //根据页的id获取页位置 id---objectId
    p.getPagePosById = function(id){
        var i1 = -1;
        var sps = this.scriptParsers,sp;
        for(var i = 0;i < sps.length;i++){
            sp = sps[i];
            i1 = sp.getPageIndex(id);
            if(i1 != -1){
                return [i1,i];
            }
        }

        return [-1,-1];
    };

    p.appendPage = function(html,i1,i2){
        i2 = i2 || 0;

        var scriptParser = this.scriptParsers[i2];

        if(null == i1 || i1 === undefined){
            i1 = scriptParser.pageLength;
            //TODO 尾页设置最后一页标志,后期根据动态可配置
            if (!dms.IS_LOOP_PLAY || this._groupsLength > 1){ //控制属否循环播放
                html = html.replace("me-lp","last-page");
            }
        }

        this._addArr[i2][i1] = true;

        this._insertArr(this._created,i1,i2,true);
        this._insertArr(this.pageContainers,i1,i2,html);

        //console.log(this.pageContainers);
        //this._insertArr(this.scriptParsers,i1,i2,null);

        if(this.scriptParsers[i2]){
            this.scriptParsers[i2].insertEmpty(i1);
            //this._pageLength = this._scriptParser.getPageSizes().length;
        }

        //if(this.swiper){
        //    this.swiper.append($el[0],index);
        //}else{
        //    this.insertSection($el,index);
        //}
    };

    //修正跳转页索引
    p._fixPageToIndex = function(pageTo){
        var arr = this._addArr;
        var fixIndex = pageTo;
        for(var i = 0;i < arr.length;i++){
            if(arr[i] && pageTo >= i){
                fixIndex++;
            }
        }
        return fixIndex;
    };

    //往数组指定位置插入一个元素
    p._insertArr = function(arr,i1,i2,el){
        if(arr[i2]){
            if(arr[i2].length < i1){
                arr[i2][i1] = el;
            }else{
                arr[i2].splice(i1,0,el);
            }
        }
        //if(arr.length < index){
        //    arr[index] = el;
        //}else{
        //    arr.splice(index,0,el);
        //}
    };

    p.resetPageState = function(i1,i2){
        i2 = i2 || 0;
        var page;
        if(this.pageContainers[i2] && (page = this.pageContainers[i2][i1])){
            $(page.element).find("*[data-change=true]").each(function(){
                var $e = $(this);
                $e.stop(true,true);
                var style = this.style;
                //style.left = "0px";
                //style.top = "0px";
                $e.css({x:"0px",y:"0px",rotate:"0",scale:"1",skewX:"0deg",skewY:"0deg"});
                //style["transform"] = "translate(0px, 0px) translateZ(0px) rotate(0deg) scale(1,1)";
                //style["-webkit-transform"] = "translate(0px, 0px) translateZ(0px) rotate(0deg) scale(1,1)";
                this.setAttribute("data-change",'false');
            });

            var container = $(page.element).find("div.magazine-page-container");
            container.stop(true);
            container.css({
                x:"0px",y:"0px"
            });
        }
    };

    //播放timeline动画
    p._playSymbol = function(i1,i2){
        i2 = i2 || 0;
        var composition = this.getCompId(i1,i2);

        var objects = this._getPageObjects(i1,i2);
        for(var i = 0;i < objects.length;i++){
            var object = objects[i];
            object.resetPlayTimeline();
        }
        if(composition){
            Cyan.Symbol.startClock();
        }else{
            Cyan.Symbol.stopClock();
        }
    };

    p.stopSymbol = function(i1,i2){
        var composition = this.getCompId(i1,i2);
        if(composition){
            composition.stop();
        }
    };

    p.getCompId = function(i1,i2){
        i2 = i2 || 0;
        var compId = this.getPageId(i1,i2);
        return Cyan.compositions[compId];
    };

    dms.MagazineManager = MagazineManager;
})(dms);