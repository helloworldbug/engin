// 文件名称: Photos_setAttr
//
// 创 建 人: fishYu
// 创建日期: 2015/12/28 17:40
// 描    述: Photos_setAttr
dms.Photos.createObject = function(item, scriptParser){
    var displayObject = new dms.Photos();
    //displayObject.userData = item;
    //ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};

dms.Photos.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
    var self = this;
    if(this.userData){
        var item = this.userData;
        var el = this.contentElement;
        this.contentElement.id = "photos-container" + dms.getNewID();
        $(this.element).addClass("pro-wrapper");
        el.style.width = item.item_width + "px";
        el.style.height = item.item_height + "px";
        el.parentNode.style.width = item.item_width + "px";
        el.parentNode.style.height = item.item_height + "px";
        this.element.style.width = item.item_width + "px";
        this.element.style.height = item.item_height + "px";
        el.style.overflow = "hidden";
        el.style.padding = "0";
        //重新定义自己的UID
        this.uid = dms.getNewID() + "";
        el.setAttribute("data-type","me-photo-swipe");
        el.setAttribute("data-uid",this.uid);
        this.initSwipe();
        //兼容之前图集点击事件，和新的事件格式
        self.addListener();
    }
};

