// 文件名称: ScriptParser
//
// 创 建 人: chenshy
// 创建日期: 2015/5/20 17:36
// 描    述: ScriptParser
(function(dms){
    var ScriptParser = function(tpl){
        this._tpl = tpl;
        this._displayObjectPages = [];
        this._pageSizes = [];
        this._pageStages = [];

        var arrScript = this._tpl.page_value;
        this._pageDatas = [];
        //console.log(arrScript);
        for(var i = 0;i < arrScript.length;i++){
            this._pageDatas.push(arrScript[i]);
        }

        this.__currentTplData = null;
        this.__currentStage = null;
        this.__currentPageObjects = null;

        /**
         * 背景的填充颜色
         * @type {Array}
         * @private
         */
        this._pageBackgroundColors = [];
        /**
         * 背景的图片
         * @type {Array}
         * @private
         */
        this._pageBackgroundImages = [];

        this._pageAnimations = [];

        this.pageLoadManager = new dms.PageLoadManager(arrScript.length);

        this.pageLength = arrScript.length;

        for(var i = 0;i < arrScript.length;i++){
            this._displayObjectPages.push(null);
            var currTpl = arrScript[i];
            var tplWidth = currTpl.page_width;
            var tplHeight = currTpl.page_height;
            this._pageSizes.push([tplWidth,tplHeight]);

            this._pageBackgroundColors[i] = null;
            this._pageBackgroundImages[i] = null;

            var colorCode = currTpl.color_code;
            //modify by fishYu 2016-3-9 11:27 增加背景颜色和背景图片共存,增加一个存储背景图片字段
            var bgCode = currTpl.bg_code || "";
            if(currTpl.color_off){
                this._pageBackgroundColors[i] = colorCode;
            }
            if(currTpl.img_off){
                if(bgCode == ""){
                    this._pageBackgroundImages[i] = colorCode;
                }else{
                    this._pageBackgroundImages[i] = bgCode;
                }
            }
            var a = currTpl.page_animation;
            if(a){
                this._pageAnimations.push(dms.toJSON(a));
            }else{
                this._pageAnimations.push(null);
            }
        }
    };

    var p = ScriptParser.prototype;

    p.getPageAnimation = function(index){
        return this._pageAnimations[index];
    };

    p.getPageByIndex = function(index){
        if(this._displayObjectPages[index]){
            return this._displayObjectPages[index];
        }

        var arrScript = this._pageDatas;

        //页数组
        var pages = this._displayObjectPages;
        var tplWidth,
            tplHeight;

        var pageSizes = [];

        this.__currentTplData = arrScript[index];

        tplWidth = this.__currentTplData.page_width;
        tplHeight = this.__currentTplData.page_height;
        this._pageSizes[index] = [tplWidth,tplHeight];

        //if(index == 0){
        //    this._pageSizes[index] = [2000,2000];
        //}

        this.__currentStage = new dms.Stage();
        this.__currentStage.pageLoadManager = this.pageLoadManager;
        this.__currentStage.pageIndex = index;
        this.__currentStage.width = tplWidth;
        this.__currentStage.height = tplHeight;

        this._pageStages[index] = this.__currentStage;

        var arr = this.__currentTplData.item_object;
        if(arr && arr.length > 0){
//			console.log(this.__currentStage)
            pages[index] = this._getItemDisplayObjects(arr);
        }
//        }

        this.__currentTplData = null;
        this.__currentStage = null;
        this.__currentPageObjects = null;

        return pages[index];
    };

    p.getPageSizes = function(){
        //return [[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000],[2000,2000]];
        return this._pageSizes;
    };

    p.getDisplayObjectPages = function(){
        return this._displayObjectPages;
    };

    /**
     * 获取所有页背景颜色
     * @returns {Array}
     */
    p.getPageBackgroundColors = function(){
        return this._pageBackgroundColors;
    };

    /**
     * 获取所有页的背景图片
     * @returns {Array}
     */
    p.getPageBackgroundImages = function(){
        return this._pageBackgroundImages;
    };

    p._getItemDisplayObjects = function(objects){
        this.__currentPageObjects = objects;
        var i,len = objects.length;

        objects = objects.sort(function(a,b){
            var aLayer = parseInt(a.item_layer);
            var bLayer = parseInt(b.item_layer);
            return aLayer - bLayer;
        });

        var returnArr = [];
        var tmpObj;
        var index = objects.length;
        for(i = 0;i < index;i++){
            tmpObj = objects[i];

            var doo = this._getItemDisplayObject(tmpObj,objects);
            if(doo){
                returnArr.push(doo);
            }
        }

        return returnArr;
    };

    p.getPageIndex = function(objectId){
        var datas = this._pageDatas,data;
        for(var i = 0;i < datas.length;i++){
            data = datas[i];
            //console.log(data);
            //根据page_uid来跳转
            if(objectId === data.page_uid){
                return i;
            }
        }
        return -1;
    };

    p.getPageData = function(){
        return this._pageDatas;
    };

    p._getItemDisplayObject = function(pageItemObject){
        var objects = this.__currentPageObjects;
        //显示对象
        var displayObject = null;
//    if (typeof(pageItemObject.group_id) == "undefined"){
//        pageItemObject.group_id", 0);
//    }

        var groupId = pageItemObject.group_id;
        var type = pageItemObject.item_type + "";
        //如果groupId>0,查找所有
        if(groupId > 0){
            //如果groupid > 0 并且 类型为文本，图片
            if(type == "3" && pageItemObject.frame_style == 2){
                //TODO 水印文字组合
                return null;
//            return createGroupObject(pageItemObject,objects);
            }else if(type == 17 || type == 26 || type == 34){ //多图边框, 字中字
                var bb = this._createDisplayObject(pageItemObject);
                return bb;
            }
            //else{
            //
            //}
            return null;
        }
//        if(type == "1" || type == "10"){
            return this._createDisplayObject(pageItemObject);
//        }

//        if(type != "10"){
//            return null;
//        }

    };

    p._createDisplayObject = function(pageItemObject){
        var objects = this.__currentPageObjects;
        //图片 文本框 水印 动画 路径 填充区 域 音频	视频
        var displayObject = null;

        var type = pageItemObject.item_type + "";
        pageItemObject.__key_id = this.__currentTplData.key_id;
        //
        //console.log(type);
        var objClass = dms.ObjectConfig[type];

        if(!objClass){
            return null;
        }

        if(!objClass.createObject){
            return null;
        }
        //文本元素，modify by fishYu 2016-9-12 15:50 为了修改APP2.9.3宽度计算错误
        if (type == "2") {//绑定页ID和投票数据
            var fixedSize = pageItemObject.fixed_size;
            if (fixedSize) {
                try {
                    fixedSize = JSON.parse(fixedSize);
                    if (fixedSize.width == false){
                        pageItemObject.item_width = 0;
                    }
                    if (fixedSize.height == false){
                        pageItemObject.item_height = 0;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        }
        displayObject = objClass.createObject(pageItemObject,this);
        displayObject.userData = pageItemObject;
        ROSetItemId.call(displayObject,pageItemObject, this);

        if (displayObject) {
            //投票元素
            if(type == "22") {//绑定页ID和投票数据
                var pid = this.__currentTplData.objectId || "";
                var pageVote = this.__currentTplData.page_vote || 0;
                displayObject.voteInfor = {pageId: pid, voteNum: pageVote};
            }
            //添加密码元素需要的一些数据
            if(type == "31"){
                var tplId = this._tpl.tpl_id || "";
                var tplType = this._tpl.tpl_type || 10;     //默认是10 表示模版，预防都能设置成失效
                var invalidDetail = this._tpl.invalid_detail || "";
                displayObject.passwordInfor = {tplId: tplId, tplType : tplType, invalidDetail : invalidDetail};
            }
            //日期倒计时
            if( type == "32" ){
                var tplType = this._tpl.tpl_type || 10;     //默认是10 表示模版，预防都能设置成失效
                var tplUser = this._tpl.author || "";       //表示作品作者
                displayObject.dateInfor = {tplType : tplType, tplUser : tplUser};
            }
            //打赏元素
            if( type == "36" ){
                var rewardInfo = {};
                rewardInfo.tplId = this._tpl.tpl_id || "";                      //作品ID
                rewardInfo.pageId = this.__currentTplData.objectId || "";     //页ID
                rewardInfo.userId = this._tpl.author || "";                     //用户ID
                rewardInfo.userHeaderSrc = this._tpl.author_img || "";          //用户头像
                rewardInfo.userName = this._tpl.author_name || "";              //用户名称
                rewardInfo.userLeave = this._tpl.author_vip_level || 0;         //用户等级
                displayObject.rewardInfor = rewardInfo;
            }

            //红包元素
            if( type == "41" ){
                var redEnvelopesInfo = {};
                redEnvelopesInfo.tplId = this._tpl.tpl_id || "";                      //作品ID
                redEnvelopesInfo.pageId = this.__currentTplData.objectId || "";     //页ID
                redEnvelopesInfo.userId = this._tpl.author || "";                     //用户ID
                redEnvelopesInfo.userHeaderSrc = this._tpl.author_img || "";          //用户头像
                redEnvelopesInfo.userName = this._tpl.author_name || "";              //用户名称
                displayObject.redEnvelopesInfo = redEnvelopesInfo;
            }
            displayObject.userData = pageItemObject;
            displayObject.dmsStage = this.__currentStage;
        }

        return displayObject;
    };



    p.mergeArr = function(arr){

        for(var i = 0;i < arr.length;i++){
            if(arr[i]){
                this.insertEmpty(i);
            }
        }
    };

    p.insertEmpty = function(index){
        //this._pageSizes.splice(index,0,null);
        //this._displayObjectPages.splice(index,0,{});
        //this._pageBackgroundColors.splice(index,0,null);
        //this._pageBackgroundImages.splice(index,0,null);
        //this._pageAnimations.splice(index,0,null);
        //this._tpl.page_value.splice(index,0,{});
        //this._pageStages.splice(index,0,null);

        this._insertArr(this._pageSizes,index,null);
        this._insertArr(this._displayObjectPages,index,{});
        this._insertArr(this._pageBackgroundColors,index,null);
        this._insertArr(this._pageBackgroundImages,index,null);
        this._insertArr(this._pageAnimations,index,null);
        this._insertArr(this._pageDatas,index,{});
        this._insertArr(this._pageStages,index,null);

        this.pageLength = this._pageSizes.length;

        //console.log(this._pageStages);
        this.resetPageIndex();
    };

    p._insertArr = function(arr,index,el){
        if(arr.length < index){
            arr[index] = el;
        }else{
            arr.splice(index,0,el);
        }
    };

    p.resetPageIndex = function(){
        var arr = this._pageStages;
        for(var i = 0;i < arr.length;i++){
            if(arr[i]){
                arr[i].pageIndex = i;
            }
        }
    };

    p.getDisplayObjectByUID = function(uid){
        var pages = this._displayObjectPages;
        var len = pages.length,page;
        var returnObj = null;
        uid = uid + "";

        var dobj;

        for(var i = 0;i < pages.length;i++){
            if(pages[i]){
                page = pages[i];
                var iLen = page.length;
                for(var j = 0;j < iLen;j++){
                    dobj = page[j];
                    if(dobj && dobj.uid === uid){
                        returnObj = page[j];
                        break;
                    }else if(dobj.constructor == dms.MultiFrame){
                        var children = dobj.children;
                        for(var z = 0;z < children.length;z++){
                            if(children[z].uid === uid){
                                returnObj = children[z];
                                break;
                            }
                        }

                        if(returnObj){
                            break;
                        }
                    }
                }

                if(returnObj){
                    break;
                }
            }
        }

        return returnObj;
    };

    p.getFieldValue = function(id,field){

    };

    p.getObject = function(id){
        var arr = this._pageDatas,data,obj;
        for(var i = 0;i < arr.length;i++){
            data = arr[i].item_object;
            for(var j = 0;j < data.length;j++){
                obj = data[j];
                if(obj.item_id == id){
                    return obj;
                }
            }
        }
        return null;
    };

    /**
     * 销毁
     */
    p.destroy = function(){
        this._pageSizes = [];
        this.pageLoadManager = null;
        if(this._displayObjectPages){
            for(var i = this._displayObjectPages.length - 1; i >= 0;i--){
                var pages = this._displayObjectPages[i];
                if(pages){
				    for(var j = pages.length - 1;j >= 0;j--){
						var obj = pages[j];
						obj.dmsStage.pageLoadManager = null;
						obj.dmsStage = null;
                        obj.stage = null;
						obj.destroy();
                    }
				}
            }
            this._displayObjectPages = [];
        }
        this._pageDatas = [];
        this._tpl = null;
    };

    dms.ScriptParser = ScriptParser;

})(dms);