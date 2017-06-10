// 文件名称: dms.WaterMark
//
// 创 建 人: chenshy
// 创建日期: 2015/5/28 11:44
// 描    述: 水印
dms.WaterMark = function(image,width,height){
    dms.ImageSprite.call(this,image,width,height);
};

dms.inherit(dms.WaterMark,dms.ImageSprite);