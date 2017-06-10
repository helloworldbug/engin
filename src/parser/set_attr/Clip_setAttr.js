// 文件名称: Clip_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/10/26 19:12
// 描    述: 设置涂抹的属性
dms.Clip.createObject = function(item, scriptParser){
    var displayObject = new dms.Clip();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    this._clipPopupView = null;
    return displayObject;
};
dms.Clip.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData) {
        var item = this.userData;
        var dataFor = item.data_for;
        var clipContent = "";
        if(dataFor){
            clipContent = this.userProperties.item_val;
        }
        var el = this.contentElement;
        if(!this._clipPopupView){
            this._clipPopupView = new dms.ClipPopupView(this.parent.element,item, clipContent, this);
        }
    }
};

