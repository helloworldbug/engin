// 文件名称: Radio_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/9/1 17:48
// 描    述: 设置单选的属性
dms.Radio.createObject = function(item, scriptParser){
    var displayObject = new dms.Radio();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Radio.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
        var item = this.userData;
        var el = this.contentElement;
        el.style.width = item.item_width + "px";
        el.style.height = item.item_height + "px";
        if(!this._radioCreator){
            this._radioCreator = new dms.RadioCreator(this.contentElement, this.userData);
        }else{
            return;
        }
    }
};

