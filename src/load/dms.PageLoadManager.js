// 文件名称: PageLoadManager
//
// 创 建 人: chenshy
// 创建日期: 2015/6/10 17:34
// 描    述: PageLoadManager
(function(dms){
    var PageLoadManager = function(){
        this._loadObjects = [];

        this.pageLoadedContext = null;
    };

    /**
     * 加载一个load
     */
    PageLoadManager.prototype.addLoad = function(object){
        if(!object.dmsStage) return;

        var objs = this._loadObjects;
        if(objs.indexOf(object) < 0){
            this._loadObjects.push(object);
            var hasSamePage = false;
            var pageIndex = object.dmsStage.pageIndex;
            //console.log("addLoad",pageIndex);
            for(var i = objs.length - 1;i >= 0;i--){
                var obj = objs[i];
                var index = obj.dmsStage.pageIndex;
                if(pageIndex === index){
                    hasSamePage = true;
                    break;
                }
            }

            if(!hasSamePage){
                if(this.onStartPageLoad){
                    this.onStartPageLoad(pageIndex);
                }
            }
        }
    };

    /**
     * 获取页的加载状态
     * @param index
     * @returns {*}
     */
    PageLoadManager.prototype.getPageLoadStatus = function(index){
        var objs = this._loadObjects;
        for(var i = objs.length - 1;i >= 0;i--){
            var obj = objs[i];
            if(obj && obj.dmsStage && obj.dmsStage.pageIndex === index){
                return false;
            }
        }
        return true;
    };

    /**
     * 删除一个Load
     */
    PageLoadManager.prototype.removeLoad = function(object){
        if(!object.dmsStage) return;

        var pageIndex = object.dmsStage.pageIndex;
        //console.log("removeLoad",pageIndex);
        var objs = this._loadObjects;
        var index = objs.indexOf(object);
        if(index >= 0){
            objs.splice(index,1);

            var hasSamePage = false;

            for(var i = objs.length - 1;i >= 0;i--){
                var obj = objs[i];
                if(obj.dmsStage.pageIndex === pageIndex){
                    hasSamePage = true;
                    break;
                }
            }

            if(!hasSamePage){
                if(this.onPageLoaded){
                    this.onPageLoaded.call(this.pageLoadedContext,pageIndex);
                }
            }
        }
    };

    PageLoadManager.prototype.destroy = function(){

        this._loadObjects = [];

        this.onPageLoaded = null;
    };

    /**
     * 页开始加载
     * @type {null}
     */
    PageLoadManager.prototype.onStartPageLoad = null;

    /**
     * 页完成加载
     * @type {null}
     */
    PageLoadManager.prototype.onPageLoaded = null;

    dms.PageLoadManager = PageLoadManager;
})(dms);