// 文件名称: dms.Container
//
// 创 建 人: chenshy
// 创建日期: 2015/6/12 19:22
// 描    述: 容器
dms.Container = function(dom){
    this.element = dom;
    dms.DisplayObject.call(this);
};

dms.inherit(dms.Container,dms.DisplayObject);