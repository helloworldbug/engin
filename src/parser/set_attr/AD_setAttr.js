// 文件名称: AD_setAttr
//
// 创 建 人: lifeng
// 创建日期: 2017/3/2 11:39
// 描    述: 设置AD的属性
dms.AD.createObject = function(item, scriptParser){
    var displayObject = new dms.AD();
    debugger;
    return displayObject;
};
dms.AD.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
        var item = this.userData;
        var el = this.contentElement;
        var itemVal = item.item_val;
       
        var style = el.style;
		style.width = item.item_width + "px";
		style.height = item.item_height + "px";
        el.width = "100%";
        el.marginwidth = "0";
        el.marginheight = "0";
        el.hspace = "0";
        el.vspace = "0";
        el.frameborder = "0";
        el.scrolling = "no";
        //设置iframe的路径
        el.src = itemVal;

    }
};