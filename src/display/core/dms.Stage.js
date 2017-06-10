// 文件名称: dms.Stage
//
// 创 建 人: chenshy
// 创建日期: 2015/5/28 16:12
// 描    述: dms.Stage
dms.Stage = function(){
    this.width = 0;
    this.height = 0;

    this.page = {
        pageIndex : -1
    };

    this.pageLoadManager = null;
};

Object.defineProperties(dms.Stage.prototype,{
    pageIndex : {
        get : function(){
            return this.page.pageIndex;
        },
        set : function(value){
            this.page.pageIndex = value;
        }
    }
});