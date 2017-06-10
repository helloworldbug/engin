// 文件名称: Text_setAttr
//
// 创 建 人: chenshy
// 创建日期: 2015/5/28 10:10
// 描    述: Text_setAttr
dms.Text.createObject = function(item, scriptParser){
    var displayObject = new dms.Text();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
//    console.log("haha");
    return displayObject;
};

dms.Text.prototype.resetAttribute = function(){
    //console.log("come");
    var self = this;
    dms.RenderObject.prototype.resetAttribute.call(this);

    if(this.userData){
        var item = this.userData;
        var text = this._text;
        //this.regX = 0;
        //this.regY = 0;

        var el = this.element;

        var font_size = item.font_size;

        var color = item.item_color;

        var width = ~~item.item_width || 0;
        var height = ~~item.item_height || 0;

        var type = item.item_type;
        var style = text.element.style;
        var dataFor = item.data_for;
        var textVal = item.item_val;
        //如果有，获取dataFor的值， 密码提示，等一些
        if(dataFor){
            textVal = this.userProperties.item_val;
        }
        var fontFamily = item.font_family;
        var fontSize = parseInt(font_size);
        //处理文字偏移，在iphone4，5上面缩小比例为26/30
        text.fontSize = font_size;
//        if(dms.isIOS()){
//            var f = $(window).width();
//            if(f  == 320 || f == 640){
//                if(width == 0){
//                    fontSize = fontSize - 5;
//                    text.fontSize = fontSize+"px";
//                }
//            }else{
//                text.fontSize = font_size;
//            }
//        }else{
//            text.fontSize = font_size;
//        }
        var _textStr = textVal.split(/(?:\r\n|\r|\n)/);
//        textVal = textVal.replace(/\n/g,"<br/>");	//把回车替换成<br />          //modify by fishYu 可以不需要替换<br/>
        //modify by fishYu 2016-3-10 11:31    //把所有的全角·全部解析成英文的 .，来解决文字偏移的问题, 2016-7-26 由于PC端用系统微软雅黑
//        textVal = textVal.replace(/·/g, ' .');
//        console.log("f",textVal);
//        if(!dms.isIOS() && !dms.isPC()){    //在安卓设备上
//            textVal = textVal.replace(/ /g, '&ensp;');
//        }
        text.htmlText = textVal;
        //对齐方式
		var align = item.font_halign=="mid"?"center":item.font_halign;
        var textAlign = align || "left";
        text.textAlign = textAlign;
        var fontStyle = item.font_style;
        var textDecoration = item.text_decoration;
        if(textDecoration){
            style.textDecoration = textDecoration;
        }
        var bgColor = item.bg_color;
        if(bgColor){
            style.backgroundColor = bgColor;
        }
        if (fontFamily) {
            //modify by fishYu 2016-9-22 11:21 增加一个回调函数，用于重置宽度为0的字体重新设置宽度
            // textVal = textVal.replace(/🏃🏻/g, ""); 
            //增加异常处理
            try{
                text.fontFamily = dms.CloundFont.loadFont(textVal,fontFamily, self.resetWidth.bind(self));
            }catch(e){
                console.log(e, "文字内容出错");
            }
        }
        if(dms.isJsonObject(color)){
            var obj = dms.toJSON(color);
            text.textColor = obj.colors[0];
        }else{
            text.textColor = color;
        }
        //设置文字竖排
        var writingMode = item.writing_mode;
        //文字是否滚动
        var itemScroll = item.item_scroll;
        //add by fishYu 2016-3-29 13:33 文字渐显的动画在ios上面不呈现了
        var animationName = item.item_animation;
        /*如果宽高都设置了文字不给换行*/
        if(width != 0 && height != 0){
            if(type != "44"){                       //modify by fishYu 2016-3-11 16:55 过滤滚动文字
                style.overflow = "hidden";        //modify by fishYu 2016-8-24 17:18  斜体的时候部分显示不出来，暂时不知道有没影响，先注释掉
            }
            //去掉滚动文字--暂时产品和内容定义--modify by fishYu 2016-1-28 18:17
            if(type == "2" && !writingMode && itemScroll){    //只是文本的时候才添加滚动, 给文字添加滚动, 竖排文字除外
//                style.overflowY = "scroll";  //SY,增加上下可以滚动
//                text.element.parentNode.style.width = (item.item_width + 50) +"px";
//                text.element.parentNode.style.height = item.item_height+ "px";
//                text.element.parentNode.style.overflowY = "scroll";  //SY,增加上下可以滚动
                style.width = item.item_width + "px";
                text.textHeight = item.item_height;// + "px";
                //去掉滚动条样式
//                $(text.element.parentNode).addClass("cancelScrollBar");
//                $(text.element.parentNode).attr("data-bar","cancel-scroll-bar");
                //必须添加父容器上面
//                $(el).addClass("pro-wrapper");
            }else{
                //如果文字有宽度
                if(width) {
                    text.textWidth = item.item_width;// + "px";
                }
                if(height && type != "44"){     //modify by fishYu 2016-3-11 16:55 过滤滚动文字
                    text.textHeight = item.item_height;// + "px";
                }
            }
        }else{
            //如果文字有宽度
            if(width) {
//            text.textWidth = (item.item_width - 1);// + "px";
                text.textWidth = item.item_width;// + "px";
            }
            if(height){
                text.textHeight = item.item_height;// + "px";
            }else{
                //就是因为没有高度的时候没设置高度，所以动画的时候引起在IOS上文字偏移闪动等问题
                //modify by fishYu 2016-3-4 15:43
                //modify by fishYu 2016-3-29 13:38  排除四个渐显的动画
                if(animationName == "clipLeftNoTrans" || animationName == "clipRightNoTrans"
                    || animationName == "clipTopNoTrans" || animationName == "clipBottomNoTrans"
                    || animationName == "fadeInUp" || animationName == "fadeInDown"){
                    style.height = "auto";
                }else{
                    //TODO 更改后会出现之前的文字偏移，这个是由于文字是缩放文字
//                    text.textHeight = 0;
                    style.height = "auto";
                }
            }
        }

        var lineHeight = item.line_height;
        var lineHeightNoDefault = item.line_height_nodefault;       //新增有可能是undefined
        if(lineHeightNoDefault == undefined) {
            if (lineHeight != 0) {	//默认lineheight为0的时候不设置line-height属性
                //YJ 处理字体偏移问题，主要出在一行字的时候，lineHeight不需要添加font_size
                //并且排除固定行高的文字，手动换行
                //YJ 判断字体长度
                if (_textStr.length >= 1 && height == 0) {	//手动换行的时候
//                console.log(lineHeight);
                    style.lineHeight = (lineHeight + fontSize) + "px";
                } else {	//非手动换行
                    if (width != 0) {	//有宽度，自动换行的时候，lineHeight = line_height + font_size
                        if (height != 0 && ((lineHeight + fontSize) < height)) {	//当设置了字体高度，并且行高+字大小 < 字高的时候才设置行间距
                            style.lineHeight = (lineHeight + fontSize) + "px";
                        } else if (height == 0) {
                            style.lineHeight = (lineHeight + fontSize) + "px";	//该情况为，有宽度，并且没高度，文字自动换行的情况
                        }
                    } else {	//单行的时候lineHeight = font_size 字体的大小
                        style.lineHeight = font_size;
                    }
                }
            } else {  //如果行高为0的情况设置行高为字体的大小
//            style.lineHeight = font_size;
            }
        }else{
            style.lineHeight = (parseInt(lineHeightNoDefault) + fontSize) + "px";
        }

        if(writingMode){
            style.WebkitWritingMode = writingMode;
            style.writingMode = writingMode;
            style.WebkiTtextOrientation = "upright";
            style.textOrientation = "upright";
            if (writingMode.indexOf("rl") > -1){
                style.writingMode = "tb-rl";
            } else if (writingMode.indexOf("lr") > -1) {
                style.writingMode = "lr-tb";
            }
        }
        if(type != "2"){
            style.display = "inline-block";
        }

//        style.wordBreak = "break-all";	//强制数字换行
        style.wordWrap = "break-word";
        style.verticalAlign = item.font_valight || "middle";

        style.letterSpacing = item.font_dist + "px";
        style.textShadow = item.font_frame ? "0px 0px " + item.frame_pixes + "px " + item.frame_color : "none";
        style.whiteSpace = width === 0 ? "pre" : "pre-wrap";
//        style.whiteSpace = "pre";
        var fontWeight = item.font_weight || "";
        style.fontWeight =  fontWeight;
        //modify by fishYu 2016-8-30 10:42 判断如果是ios系统，并且文字加粗了，那么letter-spacing -=2
        if(fontWeight == "bold" && dms.isIOS()){
            style.letterSpacing = (parseInt(style.letterSpacing) - 2 )+ "px";
        }
        if(fontStyle){
            style.fontStyle = fontStyle;
            //modify by fishYu 2016-8-30 16:07 字体斜体显示不全 ,遇到是斜体的时候强制添加宽度，并且宽度增加字体大小的0.15倍
            // if(width == 0 &&(fontStyle  == "italic" || fontStyle  == "oblique")){
            //     setTimeout(function () {
            //         var addWidth = (fontSize * 0.15);
            //         if (fontWeight == "bold" && dms.isIOS()) {
            //             addWidth = (fontSize * 0.39);       //这个属于既是斜体又加粗的情况
            //         }
            //         style.width = $(text.element).outerWidth(true) + addWidth + "px";
            //     }, 0);
            // }
        }
        var globalHalign = item.global_halign;
        var globalValign = item.global_valign;

        var dmsStage = this.dmsStage;

        var offsetWidth = 0;       
        var offsetHeight = el.offsetHeight;
        //TODO 处理全局文字宽高
        if(globalHalign){
//            el.style.left = "0px";
//            el.style.display = "inline";
//            document.body.appendChild(el);
//            console.log(el.parentNode);
            // offsetWidth = text.offsetWidth;
//            document.body.removeChild(el);
//            console.log("offsetWidth",offsetWidth,textVal);
            // el.style.left = (dmsStage.width / 2 - offsetWidth / 2) + "px";
        }


        if(globalValign){

        }

        //this.textWrapper.opacity = data["item_opacity"] / 100;

    }
};