// 文件名称: Reward_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/12/14 10:20
// 描    述: 设置内部浏览器的属性
dms.Reward.createObject = function(item, scriptParser){
    var displayObject = new dms.Reward();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Reward.prototype.resetAttribute = function(){
    dms.Text.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
		var el = this.contentElement;
        var style = el.style;
		style.width = item.item_width + "px";
		style.height = item.item_height + "px";
        style.lineHeight = item.item_height + "px";
        self.itemHref = item.item_href;
        self.addListener();
        //在非微信里面不显示
        var userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("micromessenger") < 0) { //微信里面
            this.element.style.display = "none";
        }

    }
};


