// 文件名称: dms.PicFrame
//
// 创 建 人: chenshy
// 创建日期: 2015/5/28 15:59
// 描    述: 画框
dms.PicFrame = function(image,width,height){
    dms.ImageSprite.call(this,image,width,height);
//    this._image = new Agile.Image(image,width,height);
//
//    this.addChild(this._image);
};

dms.inherit(dms.PicFrame,dms.ImageSprite);