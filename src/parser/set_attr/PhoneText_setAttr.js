// 文件名称: PhoneText_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/6/17 10:16
// 描    述: 设置电话的属性
dms.PhoneText.createObject = function(item, scriptParser){
    var displayObject = new dms.PhoneText();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.PhoneText.prototype.resetAttribute = function(){
    dms.Text.prototype.resetAttribute.call(this);
    if(this.userData){
		var item = this.userData;
		var el = this._text.element;
        var style = el.style;
        var itemValSub = item.item_val_sub || "";
        var itemHeight = item.item_height;
        var itemBorder = item.item_border;
        var bgColor = item.bg_color;
        //modify bu fishYu 2016-3-8 9:40 兼容用户自定义一键拨号的图片
        var extAttr = item.ext_attr;
        el.href = "tel:"+item.item_val;
        if(!extAttr){
            style.textDecoration = "none";
//        $(el).addClass("icon-dialing");
            $(el).attr("data-type","me-dialing");
            if(!itemValSub){
//            $(el).addClass("icon-dialing-cancel-content");
                $(el).attr("data-type","me-dialing-cancel-content");
            }
            style.textIndent = "-5px";
        }else{
            style.backgroundImage = "url('"+extAttr+"')";
            style.backgroundPosition = "center";
            style.backgroundRepeat = "no-repeat";
        }
        el.innerHTML = itemValSub;
        style.lineHeight = (itemHeight - 2*itemBorder) + "px";
        style.outline = "none";	//取消input和textarea的聚焦边框：
        style.overflow = "hidden";
        if(bgColor){
            style.backgroundColor = bgColor;
        }
    }
};