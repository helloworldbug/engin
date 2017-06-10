// 文件名称: ScrollText_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2016/3/10 14:08
// 描    述: ScrollText_setAttr
dms.ScrollText.createObject = function(item, scriptParser){
    var displayObject = new dms.ScrollText();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};

dms.ScrollText.prototype.resetAttribute = function(){
    dms.Text.prototype.resetAttribute.call(this);
    var self = this;
    if(this.userData) {
        var item = this.userData;
        var text = this._text.element;
        var el = this.element;
        var height = ~~item.item_height || 0;
        var width = ~~item.item_width || 0;
        var endScript = item.animate_end_act;       //脚本
        var style = text.style;
        //必须添加父容器上面
        $(el).addClass("pro-wrapper");
        //去掉滚动文字--暂时产品和内容定义--modify by fishYu 2016-1-28 18:17
        //处理在android QQ浏览器里面显示不全的方案
        text.parentNode.style.width = (width + 50) +"px";
        text.parentNode.style.height = height+ "px";
        text.parentNode.style.overflowY = "scroll";  //SY,增加上下可以滚动
//        style.overflowY = "auto";
        //去掉滚动条样式
        $(text.parentNode).attr("data-bar","cancel-scroll-bar");
        $(text).attr("data-bar","cancel-scroll-bar");
        //文字滚动到底部的时候执行脚本。可以跳页，显示隐藏元素，打开关闭音视频等
        text.parentNode.onscroll = function(e){
            //滚动到文字底部的时候
            if(this.scrollTop == (this.scrollHeight - height)){
                if(endScript){
//                    dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over", endScript));
                    self.execAnimationEndAct();
                }
            }
        }
    }
};