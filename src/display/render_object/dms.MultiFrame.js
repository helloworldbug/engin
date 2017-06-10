// 文件名称: dms.MultiFrame
//
// 创 建 人: chenshy
// 创建日期: 2015/6/11 18:50
// 描    述: 多图框
dms.MultiFrame = function(){
    dms.RenderObject.call(this);
    var el = this.element;
    el.style.overflow = "hidden";
};

dms.inherit(dms.MultiFrame, dms.RenderObject);
/**
 *增加点击显示元素事件的回调方法
 */
dms.MultiFrame.prototype.onShow = function () { 
    var children = this.children;
    for (var i = 0; i < children.length; i++) { 
        if (children[i].onShow) { 
            children[i].onShow();
        }
    }
}