// 文件名称: ShowBox_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2016/3/8 18:50
// 描    述: 显示模块的内嵌IFrame呈现框设置属性
dms.ShowBox.createObject = function(item, scriptParser){
    var displayObject = new dms.ShowBox();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.ShowBox.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
        var item = this.userData;
        var el = this.contentElement;
        var itemVal = item.item_val;
        if(dms.isPC()){
//            window.open(itemVal);
            window.location.href = itemVal;
            return;
        }
        var style = el.style;
		style.width = item.item_width + "px";
		style.height = item.item_height + "px";
        el.width = "100%";
        el.marginwidth = "0";
        el.marginheight = "0";
        el.hspace = "0";
        el.vspace = "0";
        el.frameborder = "0";
        el.scrolling = "yes";
        //设置iframe的路径
        el.src = itemVal;

    }
};


