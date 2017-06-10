// 文件名称: Disorderly_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/11/26 19:13
// 描    述: Disorderly_setAttr
dms.Disorderly.createObject = function(item, scriptParser){
    var displayObject = new dms.Disorderly();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};

dms.Disorderly.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
    if(this.userData){
        var item = this.userData;
        var text = this._text;
        var el = this.element;

        var font_size = item.font_size;

        var color = item.item_color;

        var width = ~~item.item_width || 0;
        var height = ~~item.item_height || 0;
        var itemValSub = item.item_val_sub || "0";      //打乱的算法 0, 随机打乱
        var type = item.item_type;
        var style = text.element.style;
        var textVal = item.item_val;
        var fontFamily = item.font_family;
        var fontSize = parseInt(font_size);
        text.fontSize = font_size;


        var _textStr = textVal.split(/(?:\r\n|\r|\n)/);
        var tempVal = "";
        for(var i = 0; i < _textStr.length; i++){
            tempVal += this.disorderlyTxt(_textStr[i], itemValSub) + "\n";
        }
        tempVal = tempVal.replace(/\n/g,"<br/>");	//把回车替换成<br />
        text.htmlText = tempVal;

        //对齐方式
		var align = item.font_halign=="mid"?"center":item.font_halign;
        var textAlign = align || "left";
        text.textAlign = textAlign;
        var fontStyle = item.font_style;
        var textDecoration = item.text_decoration;
        if(fontStyle){
            style.fontStyle = fontStyle;
        }
        if(textDecoration){
            style.textDecoration = textDecoration;
        }
        var bgColor = item.bg_color;
        if(bgColor){
            style.backgroundColor = bgColor;
        }
        //如果文字有宽度
        if(width) {
            text.textWidth = (item.item_width - 1);// + "px";
        }
        if(height){
            text.textHeight = item.item_height;// + "px";
        }

        if(fontFamily){
            text.fontFamily = dms.CloundFont.loadFont(textVal,fontFamily);
        }
        if(dms.isJsonObject(color)){
            var obj = dms.toJSON(color);
            text.textColor = obj.colors[0];
        }else{
            text.textColor = color;
        }

        /*如果宽高都设置了文字不给换行*/
        if(width != 0 && height != 0){
            text.element.style.overflow = "hidden";
            text.element.style.overflowY = "auto";  //SY,增加上下可以滚动
        }

        var lineHeight = item.line_height;
//        console.log(lineHeight);
        if(lineHeight != 0){	//默认lineheight为0的时候不设置line-height属性
            //YJ 处理字体偏移问题，主要出在一行字的时候，lineHeight不需要添加font_size
            //并且排除固定行高的文字，手动换行
            //YJ 判断字体长度
            if(_textStr.length >= 1 &&  height == 0){	//手动换行的时候
//                console.log(lineHeight);
                style.lineHeight = (lineHeight + fontSize) + "px";
            }else{	//非手动换行
                if(width != 0){	//有宽度，自动换行的时候，lineHeight = line_height + font_size
                    if(height != 0 && ((lineHeight + fontSize) < height)){	//当设置了字体高度，并且行高+字大小 < 字高的时候才设置行间距
                        style.lineHeight = (lineHeight + fontSize) + "px";
                    }else if(height == 0){
                        style.lineHeight = (lineHeight + fontSize) + "px";	//该情况为，有宽度，并且没高度，文字自动换行的情况
                    }
                }else{	//单行的时候lineHeight = font_size 字体的大小
                    style.lineHeight = font_size;
                }
            }
        }else{  //如果行高为0的情况设置行高为字体的大小
//            style.lineHeight = font_size;
        }

        style.display = "inline-block";
        style.wordBreak = "break-all";	//强制数字换行
        style.verticalAlign = item.font_valight || "middle";

        style.letterSpacing = item.font_dist + "px";
        style.textShadow = item.font_frame ? "0px 0px " + item.frame_pixes + "px " + item.frame_color : "none";
        style.whiteSpace = width === 0 ? "pre" : "pre-wrap";
		style.fontWeight =  item.font_weight || "";

        var globalHalign = item.global_halign;
        var globalValign = item.global_valign;

        var dmsStage = this.dmsStage;

        var offsetWidth = 0;
        var offsetHeight = el.offsetHeight;

        //TODO 处理全局文字宽高
        if(globalHalign){
            offsetWidth = text.offsetWidth;
            el.style.left = (dmsStage.width / 2 - offsetWidth / 2) + "px";
        }

        if(globalValign){

        }

    }
};

