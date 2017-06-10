// 文件名称: InnerBrowse_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/12/14 10:20
// 描    述: 设置内部浏览器的属性
dms.InnerBrowse.createObject = function(item, scriptParser){
    var displayObject = new dms.InnerBrowse();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.InnerBrowse.prototype.resetAttribute = function(){
    dms.Text.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
		var el = this.contentElement;
        var style = el.style;
        el.innerHTML = item.item_val_sub
		style.width = item.item_width + "px";
		style.height = item.item_height + "px";
        style.lineHeight = item.item_height + "px";
        self.addListener();
    }
};



