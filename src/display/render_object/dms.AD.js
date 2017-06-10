// 文件名称: AD广告元素
//
// 创 建 人: lifeng
// 创建日期: 2017/3/2 11:38
// 描    述: AD广告元素
dms.AD = function(text){
	 this.contentElement = document.createElement("iframe");
    dms.RenderObject.call(this);
     this.addListener();
};
dms.inherit(dms.AD,dms.RenderObject);
//销毁
dms.AD.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
};
dms.AD.prototype.addListener =function(){
    var self = this;
  this.onClick = function(e){
        e.stopPropagation();
        e.preventDefault();
       
    };
};