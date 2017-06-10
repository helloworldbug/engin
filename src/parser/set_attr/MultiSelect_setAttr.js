// 文件名称: MultiSelect_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/9/1 17:48
// 描    述: 设置多选的属性
dms.MultiSelect.createObject = function(item, scriptParser){
    var displayObject = new dms.MultiSelect();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.MultiSelect.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
    var self = this;
    if(this.userData){
        var item = this.userData;
        var el = this.contentElement;
        el.style.width = item.item_width + "px";
        el.style.height = item.item_height + "px";
        if(!this._checkboxCreator){
            this._checkboxCreator = new dms.CheckboxCreator(this.contentElement, this.userData);
        }else{
            return;
        }
    }
};

