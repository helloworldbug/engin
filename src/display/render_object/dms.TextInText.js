// 文件名称: dms.TextInText
//
// 创 建 人: chenshy
// 创建日期: 2015/10/29 14:18
// 描    述: 字中字
dms.TextInText = function(){
    dms.RenderObject.call(this);

    this._backText = new dms.Text();
    this._frontText = null;

    this.addChild(this._backText);
};

dms.inherit(dms.TextInText,dms.RenderObject);

dms.TextInText.prototype.addFrontText = function(text){
    this._frontText = text;
    this.addChild(text);
};

dms.TextInText.prototype.resetClip = function(){
    var backText = this._backText;
    var frontText = this._frontText;
    var backEl = backText._text.element;
    var frontEl = frontText._text.element;

    var backParent = backEl.parentNode;
    var frontParent = frontEl.parentNode;

    if(backParent){
        backParent.removeChild(backEl);
    }

    if(frontParent){
        frontParent.removeChild(frontEl);
    }

    document.body.appendChild(backEl);
    document.body.appendChild(frontEl);
    var backScaleY = backText.getScaleY();
    var backHeight = backEl.clientHeight;
    //console.log(backEl.style.height);
    var backWidth = backEl.clientWidth;
    var frontHeight = (frontEl.clientHeight * frontText.getScaleY()) / backScaleY;


    document.body.removeChild(backEl);
    document.body.removeChild(frontEl);

    backParent.appendChild(backEl);
    frontParent.appendChild(frontEl);

    var frontTop = frontText.top;
    var backTop = backText.top;
    var m = (frontTop - backTop) / backScaleY;

    var path = backWidth + "px " + m + "px," + backWidth + "px 0px," +
               "0px 0px,0px " + m + "px," + backWidth + "px " + m + "px," +
        (backWidth) + "px " + (m + frontHeight) + "px,0px " + (m + frontHeight) + "px," +
            "0px " + backHeight + "px," + backWidth + "px " + backHeight + "px,"
            + backWidth + "px " + (m + frontHeight) + "px";

    backEl.style["-webkit-clip-path"] = "polygon(" + path + ")";

    //console.log(backTop,frontTop);

    //setTimeout(function(){
    //    console.log(backEl.clientHeight);
    //    console.log(frontEl.offsetHeight);
    //},100);
};