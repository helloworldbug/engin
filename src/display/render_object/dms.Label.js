// 文件名称: Label
//
// 创 建 人: fishYu
// 创建日期: 2015/12/30 18:50
// 描    述: 显示模块的标签
dms.Label = function(){
    dms.RenderObject.call(this);
};
dms.inherit(dms.Label,dms.RenderObject);
//销毁
dms.Label.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
};