// 文件名称: SVGShape
//
// 创 建 人: fishYu
// 创建日期: 2016/12/29 16:04
// 描    述: 显示模块的SVG形状
dms.SVGShape = function(){
    dms.RenderObject.call(this);
};
dms.inherit(dms.SVGShape,dms.RenderObject);
//销毁
dms.SVGShape.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
};