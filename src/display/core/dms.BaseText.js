// 文件名称: dms.BaseText
//
// 创 建 人: chenshy
// 创建日期: 2015/6/12 22:00
// 描    述: 文本对象
dms.BaseText = function(text){
    dms.DisplayObject.call(this);
    this._textStr = text;
    this._textColor = "#000000";
    this._fontSize = "20px";
    this._textAlign = "left";
    this._fontFamily = "Arial";
    this._textWidth = 0;
    this._textHeight = 0;

    this.textColor = this._textColor;
    this.fontSize = this._fontSize;
    this.textAlign = this._textAlign;
    this.fontFamily = this._fontFamily;

    //this._textType =
};

dms.inherit(dms.BaseText,dms.DisplayObject);

Object.defineProperties(dms.BaseText.prototype,{
    htmlText: {
        get: function(){
            return this._textStr;
        },
        set: function(value){
            this._textStr = value;
            this.element.innerHTML = value;
            //防止注入 add by fishYu
            // function htmlEncode ( value ) {  
            //     var ele = document.createElement('span');  
            //     ele.appendChild( document.createTextNode( value ) );  
            //     return ele.innerHTML;  
            // }  
            // this._textStr = htmlEncode(value);
            // // console.log(htmlEncode(value));
            // this.element.innerHTML = htmlEncode(value);
        }
    },
    textColor: {
        get: function(){
            return this._textColor;
        },
        set: function(value){
            this.element.style.color = value;
        }
    },
    fontSize: {
        get: function(){
            return this._fontSize;
        },
        set: function(value){
            this._fontSize = value;
            this.element.style.fontSize = value;
        }
    },
    textAlign: {
        get: function(){
            return this._textAlign;
        },
        set: function(value){
            this.element.style.textAlign = value;
        }
    },
    textWidth: {
        get: function(){
            return this._textWidth;
        },
        set: function(value){
            this._textWidth = value;
            this.element.style.width = value + "px";
        }
    },
    textHeight: {
        get: function(){
            return this._textHeight;
        },
        set: function(value){
            this._textHeight = value;
            this.element.style.height = value + "px";
        }
    },
    fontFamily: {
        get: function(){
            return this._fontFamily;
        },
        set: function(value){
            this._fontFamily = value;
            this.element.style.fontFamily = value;
        }
    }
});

///**
// * 文本
// */
//dms.BaseText.prototype.__defineGetter__("htmlText",function(){
//    return this._textStr;
//});
//dms.BaseText.prototype.__defineSetter__("htmlText",function(value){
//    this._textStr = value;
////    console.log(value);
//    this.element.innerHTML = value;
//});
//
///**
// * 字颜色
// */
//dms.BaseText.prototype.__defineGetter__("textColor",function(){
//    return this._textColor;
//});
//dms.BaseText.prototype.__defineSetter__("textColor",function(value){
//    this.element.style.color = value;
//});
//
///**
// * 字大小
// */
//dms.BaseText.prototype.__defineGetter__("fontSize",function(){
//    return this._fontSize;
//});
//dms.BaseText.prototype.__defineSetter__("fontSize",function(value){
//    this._fontSize = value;
//    this.element.style.fontSize = value;
//});
//
///**
// * 字水平对齐方式
// */
//dms.BaseText.prototype.__defineGetter__("textAlign",function(){
//    return this._textAlign;
//});
//dms.BaseText.prototype.__defineSetter__("textAlign",function(value){
//    this.element.style.textAlign = value;
//});
//
//dms.BaseText.prototype.__defineGetter__("textWidth",function(){
//    return this._textWidth;
//});
//dms.BaseText.prototype.__defineSetter__("textWidth",function(value){
//    this._textWidth = value;
//    this.element.style.width = value + "px";
//});
//dms.BaseText.prototype.__defineGetter__("textHeight",function(){
//    return this._textHeight;
//});
//dms.BaseText.prototype.__defineSetter__("textHeight",function(value){
//    this._textHeight = value;
//    this.element.style.height = value + "px";
//});
//
//dms.BaseText.prototype.__defineGetter__("fontFamily",function(){
//    return this._fontFamily;
//});
//dms.BaseText.prototype.__defineSetter__("fontFamily",function(value){
//    this._fontFamily = value;
//    this.element.style.fontFamily = value;
//});
