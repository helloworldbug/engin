// 文件名称: PicFrame_setAttr
//
// 创 建 人: chenshy
// 创建日期: 2015/5/28 16:28
// 描    述: PicFrame_setAttr
dms.PicFrame.createObject = function(item, scriptParser){
    var displayObject = new dms.PicFrame();
//        console.log("pic");
//    displayObject.userData = item;
//    ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};
dms.PicFrame.prototype.resetAttribute = function(){
    dms.ImageSprite.prototype.resetAttribute.call(this);
    if(this.userData){
        var pf = this;
        var item = this.userData;

        var width = item.item_width;
        var height = item.item_height;

        var stageSize = this.dmsStage || {width:0,height:0};
        var style = this.contentElement.style;
        this.element.style.pointerEvents = "none";  //画框没有点击事件
        if(width == 0){
            width = stageSize.width;
        }

        if(height == 0){
            height = stageSize.height;
        }

        pf.width = (width);
        pf.height = (height);
        // modify by fishYu 2016-3-7 15：13 画框的位置动态设置，不是整屏。
        pf.left = 0;
        pf.top = 0;
    }
};