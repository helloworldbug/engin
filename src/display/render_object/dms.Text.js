// 文件名称: Text
//
// 创 建 人: chenshy
// 创建日期: 2015/5/28 10:04
// 描    述: 文本
dms.Text = function(text, size, align, color){


    if(!this._text){
        this._text = new dms.BaseText(text, size, align, color);
    }

    this.contentElement = this._text.element;
    dms.RenderObject.call(this);

//
//
//	this._text.element.style.position = "relative";
//
//    this._animateClassObjects.push(this._text);
//    this.addChild(this._text);
};

dms.inherit(dms.Text, dms.RenderObject);
/**
 *宽度为0的情况想等云字体加载完毕再重新设置宽度  modify by fishYu 2016-9-21 16:40
 */
dms.Text.prototype.resetWidth = function () {
    var self = this;
    var item = self.userData;
    var width = ~~item.item_width || 0;
    var text = self._text;
    var style = text.element.style;
    var font_size = item.font_size;
    var fontSize = parseInt(font_size);
    var fontWeight = item.font_weight || "";
    //modify by fishYu 2016-8-30 16:07 字体斜体显示不全 ,遇到是斜体的时候强制添加宽度，并且宽度增加字体大小的0.15倍
    if(width == 0 ){
        var addWidth = (fontSize * 0.2);
        if (fontWeight == "bold" && dms.isIOS()) {
            addWidth = (fontSize * 0.39);       //这个属于既是斜体又加粗的情况
        }
        style.width = $(text.element).outerWidth(true) + addWidth + "px";
    }
};

