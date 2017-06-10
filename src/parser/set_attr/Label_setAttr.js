// 文件名称: Label_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/12/14 10:20
// 描    述: 设置标签的属性
dms.Label.createObject = function(item, scriptParser){
    var displayObject = new dms.Label();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Label.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
		var el = this.contentElement;
        var style = el.style;
		style.width = item.item_width + "px";
		style.height = item.item_height + "px";
        style.lineHeight = item.item_height + "px";

        new dms.LabelCreator(el, item);
    }
};


