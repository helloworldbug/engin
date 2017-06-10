// 文件名称: Scratch
//
// 创 建 人: fishYu
// 创建日期: 2015/11/30 11:24
// 描    述: 真假话，刮刮乐
dms.Scratch = function(text, size, align, color){


    if(!this._text){
        this._text = new dms.BaseText(text, size, align, color);
    }

    this.contentElement = this._text.element;
    dms.RenderObject.call(this);

};

dms.inherit(dms.Scratch,dms.RenderObject);

