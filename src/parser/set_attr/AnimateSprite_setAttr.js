// 文件名称: AnimateSprite_setAttr
//
// 创 建 人: chenshy
// 创建日期: 2015/12/31 16:30
// 描    述: AnimateSprite_setAttr
dms.AnimateSprite.createObject = function(item, scriptParser){
    var displayObject = new dms.AnimateSprite();
//    item.__key_id = ___currentTplData.key_id;
//        console.log("groupid",item.group_id);
//    displayObject.userData = item;
//    ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};

dms.AnimateSprite.prototype.resetAttribute = function(){
    dms.ImageSprite.prototype.resetAttribute.call(this);
    var item = this.userData;
    this.imageRect = item.image_rect;

};