// 文件名称: RedEnvelopes_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2016/1/19 17:02
// 描    述: 设置红包的属性
dms.RedEnvelopes.createObject = function(item, scriptParser){
    var displayObject = new dms.RedEnvelopes();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.RedEnvelopes.prototype.resetAttribute = function(){
    dms.ImageSprite.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
		var el = this.contentElement;
        var style = el.style;
//		style.width = item.item_width + "px";
//		style.height = item.item_height + "px";
//        style.lineHeight = item.item_height + "px";
        self.itemHref = item.item_href;
        self.envelopesId = item.item_val_sub;    //红包ID
        self.addListener();

        //在非微信里面不显示,红包修改为所有终端可见,  2016-1-31 13-14
//        var userAgent = navigator.userAgent.toLowerCase();
//        if (userAgent.indexOf("micromessenger") < 0) { //微信里面
//            this.element.style.display = "none";
//        }
    }
};


