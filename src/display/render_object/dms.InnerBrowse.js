// 文件名称: InnerBrowse
//
// 创 建 人: fishYu
// 创建日期: 2015/12/14 10:22
// 描    述: 显示模块的内嵌iframe
dms.InnerBrowse = function(text){
    dms.Text.call(this,text);
};

dms.inherit(dms.InnerBrowse,dms.Text);

dms.InnerBrowse.prototype._showIframeView = function(){
    var contentWrapper = this.stage || this.parent.stage;
    this.containerEl = this.parent.element;
    new dms.IframePopupView(contentWrapper[0], this.containerEl, this.userData.item_val);
};
//销毁
dms.InnerBrowse.prototype.destroy = function(){
    dms.Text.prototype.destroy.call(this);
};

dms.InnerBrowse.prototype.addListener = function(){
    var self = this;
    this.onClick = function(e){
        e.stopPropagation();
        e.preventDefault();
        self._showIframeView();
    };
};