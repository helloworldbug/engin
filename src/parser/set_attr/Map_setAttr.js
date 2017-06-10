// 文件名称: Map_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/6/19 14:57
// 描    述: 设置地图的属性
dms.Map.createObject = function(item, scriptParser){
    var displayObject = new dms.Map();
    //displayObject.userData = item;
	//ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Map.prototype.resetAttribute = function(){
    dms.ImageSprite.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
        var item = this.userData;
        var itemVal = item.item_val;
        var width = ~~item.item_width;
        var height = ~~item.item_height;
        //地图的时候，图片链接地址需要拼接
        self.addListener();
    }
};

