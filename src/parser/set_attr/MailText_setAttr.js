// 文件名称: MailText_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/6/17 10:25
// 描    述: 设置邮件的属性
dms.MailText.createObject = function(item, scriptParser){
    var displayObject = new dms.MailText();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.MailText.prototype.resetAttribute = function(){
    dms.Text.prototype.resetAttribute.call(this);
    if(this.userData){
		var item = this.userData;
		var el = this._text.element;
		el.href = "Mailto:"+item.item_val;
		el.style.textDecoration = "none";
        el.style.border = "none";
		el.style.outline = "none";	//取消input和textarea的聚焦边框：
    }
};