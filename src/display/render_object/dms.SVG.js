// 文件名称: SVG
//
// 创 建 人: fishYu
// 创建日期: 2015/12/31 17:01
// 描    述: 显示模块的SVG
dms.SVG = function(){
    dms.RenderObject.call(this);
};
dms.inherit(dms.SVG,dms.RenderObject);
//销毁
dms.SVG.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
};