// 文件名称: SVGShape_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2016/12/29 16:06
// 描    述: 设置SVG图形的属性
dms.SVGShape.createObject = function(item, scriptParser){
    var displayObject = new dms.SVGShape();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.SVGShape.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
		var el = this.contentElement;
        var style = el.style;
		style.width = item.item_width + "px";
		style.height = item.item_height + "px";
        var itemVal = item.item_val;
        //强制把设置透明度取消掉
        style.opacity = 1;
        if(!itemVal){
            return;
        }
        itemVal = itemVal.replace(/&lt;/g,"<").replace(/&gt;/g,">");
        el.innerHTML = itemVal;
    }
};


