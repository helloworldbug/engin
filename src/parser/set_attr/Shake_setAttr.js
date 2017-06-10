// 文件名称: Shake_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/10/28 19:05
// 描    述: LongPress_setAttr
dms.Shake.createObject = function(item, scriptParser){
    var displayObject = new dms.Shake();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.Shake.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
    var self = this;
    if(this.userData){
        var item = this.userData;
        var el = this.contentElement;
        var color = item.item_color;
        var fontSize = item.font_size;
        var itemVal = item.item_val;
        var isPlay = item.auto_play;
        el.style.width = item.item_width + "px";
        el.style.height = item.item_height + "px";
        if(color){
            el.style.color = color;
        }
        if(fontSize){
            el.style.fontSize = fontSize;
        }
        $(el).addClass("me-yaoyiyao yaoYiYao");
//        $(el).parent().addClass("yaoYiYao");
        var itemHref = item.item_href;
        this.endScript = item.animate_end_act;
        //增加了一个第一次出来的时候开始的开关
//        if (isPlay) {
            this.startShake();
//        }
    }
};
