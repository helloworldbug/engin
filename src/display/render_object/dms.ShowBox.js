// 文件名称: ShowBox
//
// 创 建 人: fishYu
// 创建日期: 2016/3/8 18:50
// 描    述: 显示模块的内嵌IFrame呈现
dms.ShowBox = function(){
    this.contentElement = document.createElement("iframe");
    dms.RenderObject.call(this);

};
dms.inherit(dms.ShowBox,dms.RenderObject);
//销毁
dms.ShowBox.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
};