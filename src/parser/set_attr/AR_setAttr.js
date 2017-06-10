// 文件名称: AR_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2016/6/14 11:39
// 描    述: 设置AR的属性
dms.AR.createObject = function(item, scriptParser){
    var displayObject = new dms.AR();
    return displayObject;
};
dms.AR.prototype.resetAttribute = function(){
    dms.Text.prototype.resetAttribute.call(this);
    if(this.userData){
		var item = this.userData;
		var el = this._text.element;
        var content = item.item_val ?item.item_val :item.item_val_sub;
        el.innerHTML = content;
        el.style.lineHeight = item.item_height + "px";
    }
};