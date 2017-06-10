// 文件名称: WaterMark_setAttr
//
// 创 建 人: chenshy
// 创建日期: 2015/5/28 13:51
// 描    述: WaterMark_setAttr
dms.WaterMark.createObject = function(item,scriptParser){
    var displayObject = new dms.WaterMark();
    //displayObject.userData = item;
    displayObject.userProperties = {};

    //var itemValue = scriptParser.getFieldValue(item.item_id,"item_value");
    //var obj = scriptParser.getObject(id);
    //
    //itemValue = obj.item_value;

    //ROSetItemId.call(displayObject,item, scriptParser);
//    console.log("df");
    return displayObject;
};
dms.WaterMark.prototype.resetAttribute = function(){
    dms.ImageSprite.prototype.resetAttribute.call(this);
    if(this.userData){

        //var userProperty = this.userProperties;
//        console.log("df");
//        var item = this.userData;
//        var frameStyle = item.frame_style;//1贴纸水印 2签章 3形状
//
//        var wm = this; //new createjs.EiditWaterMark(type2);
////        if(frameStyle == 3){
////            wm = new ms.EditShape();
////        }else if(frameStyle == 2){
////            wm = new ms.EditSignature();
////        }else{
////            wm = new ms.EditWaterMark();
////        }
//
////        var imageUrl = item.item_val;
//
//
//        var width = item.item_width;
//        var height = item.item_height;
//        var style = this.element.style;
//        if(width){
//            wm.width = width;
//        }
//
//        if(height){
//            wm.height = height;
//        }
//
//        style.backgroundRepeat = "no-repeat";
//        style.backgroundSize = "100% 100%";
//        dms.addImageToLoad(wm);
//        wm.image = item.item_val;
//        if(item.get("item_color") && item.get("item_color") != "FFFFFF"){
////            console.log();
//            wm.setMarkColor(item.get("item_color"));
//        }
    }
};