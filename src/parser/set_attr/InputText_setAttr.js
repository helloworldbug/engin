// 文件名称: InputText_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/6/17 10:30
// 描    述: 设置输入框的属性
dms.InputText.createObject = function(item, scriptParser){
    var displayObject = new dms.InputText();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.InputText.prototype.resetAttribute = function(){
    dms.Text.prototype.resetAttribute.call(this);
    if(this.userData){
		var item = this.userData;
		var el = this._text.element;
		var textStr = item.item_val;
		el.innerHTML = "";	//默认继承文本，设置了显示内容，把内容清空
        if(textStr){
            el.placeholder = textStr;	//设置placeholder为文本内容
        }
//		var fbField = item.fb_field;
//        if(fbField){
//            if(fbField.indexOf("qq") > -1 || fbField.indexOf("phone") > -1){
//                el.type="tel";
//                if(fbField.indexOf("qq") > -1 ){
//                    el.setAttribute("oninput","checkTextLength(this, 12)");
//                }
//                if(fbField.indexOf("phone") > -1 ){
//                    el.setAttribute("oninput","checkTextLength(this, 11)");
//                }
//            }else if(fbField.indexOf("email") > -1){
//                el.type="mail";
//            }else{
//                el.type="text";
//                if(fbField.indexOf("sex") > -1 ){
//                    el.maxLength = 2;
//                }
//                if(fbField.indexOf("constellation") > -1 ){
//                    el.maxLength = 5;
//                }
//                if(fbField.indexOf("username") > -1 ){
//                    el.maxLength = 5;
//                }
//            }
//            el.setAttribute("data-fb-field", fbField);
//        }else{
//            el.type="text";
//        }
		el.setAttribute("data-input", "user-input");	//添加字段输入
        el.setAttribute("data-objectId", item.objectId);	//添加作品元素的objectId
        el.style.verticalAlign =  "middle";
        el.style.boxSizing =  "border-box";
        var bgColor = item.bg_color;    //背景颜色
        if(!bgColor){
            el.style.backgroundColor = "transparent";
        }
        var item_height = item.item_height || 0;
        el.style.lineHeight = item_height + "px";
        //TODO 暂定为10PX
        el.style.paddingLeft = "10px";
		el.style.outline = "none";	//取消input和textarea的聚焦边框：
		el.style.resize = "none";	//取消textarea可拖动放大：
    }
};
/*数字输入的时候检测*/
function checkTextLength (obj, length) {

    if(obj.value.length > length)   {

        obj.value = obj.value.substr(0, length);
    }

}