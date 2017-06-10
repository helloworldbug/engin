// 文件名称: dms.VerticalText
//
// 创 建 人: chenshy
// 创建日期: 2015/11/25 15:12
// 描    述: dms.VerticalText
(function(dms){
    var VerticalText = function(){
        dms.RenderObject.call(this);
    };

    dms.inherit(VerticalText,dms.RenderObject);

    var p = VerticalText.prototype;

    dms.VerticalText = VerticalText;
})(dms);