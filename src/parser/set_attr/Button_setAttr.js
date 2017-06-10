// 文件名称: Button_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/8/12 18:00
// 描    述: 设置按钮的属性
dms.Button.createObject = function(item, scriptParser){
    var displayObject = new dms.Button();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Button.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
	var self = this;
    if(this.userData){
		var item = this.userData;
		var el = this.contentElement;

        var font_size = item.font_size;

        var color = item.item_color;

        var width = ~~item.item_width || 0;
        var height = ~~item.item_height || 0;

        var style = el.style;
        var textVal = item.item_val;
        var fontFamily = item.font_family;
        style.fontSize = font_size;
        var item_cntype = item.item_cntype;     //内容类型为2的时候设置背景图片
        if(item_cntype == 2){
            style.background = "url('"+textVal+"') no-repeat center";
        }else{
            el.innerHTML = textVal;
        }


        //对齐方式
        var align = item.font_halign=="mid"?"center":item.font_halign;
        var textAlign = align || "center";
        style.textAlign = textAlign;
        var fontStyle = item.font_style;
        var textDecoration = item.text_decoration;
        if(fontStyle){
            style.fontStyle = fontStyle;
        }
        if(textDecoration){
            style.textDecoration = textDecoration;
        }

        //如果文字有宽度
        if(width) {
            style.width = width+ "px";
        }
        if(height){
            style.height = height + "px";
        }


        style.fontFamily = dms.CloundFont.loadFont(textVal,fontFamily);
        //modify by fishYu 2016-4-28 14:41 修改提交按钮的行高
        var borderWidth = item.item_border || 0;
        style.lineHeight = (height-2*borderWidth) + "px";

        style.letterSpacing = item.font_dist + "px";
        style.textShadow = item.font_frame ? "0px 0px " + item.frame_pixes + "px " + item.frame_color : "none";
        style.whiteSpace = width === 0 ? "pre" : "pre-wrap";
        style.fontWeight =  item.font_weight || "";
        var bgColor = item.bg_color;
        var color = item.item_color;
        if(bgColor){
            style.backgroundColor = bgColor;
        }
        if(color){
            style.color = color;
        }
    }
};

