// 文件名称: Map
//
// 创 建 人: fishYu
// 创建日期: 2015/6/19 14:51
// 描    述: 地图
dms.Map = function(image,width,height){
    dms.ImageSprite.call(this,image,width,height);
};

dms.inherit(dms.Map,dms.ImageSprite);

dms.Map.prototype._showMapIframeView = function(){
    var contentWrapper = this.stage || this.parent.stage;
    this.containerEl = this.parent.element;
    new dms.IframePopupView(contentWrapper[0], this.containerEl, this.userData.item_val, this.userData.item_type);
};
//销毁
dms.Map.prototype.destroy = function(){
    dms.ImageSprite.prototype.destroy.call(this);
};

dms.Map.prototype.addListener = function(){
    var self = this;
    this.onClick = function(e){
        e.stopPropagation();
        e.preventDefault();
        self._showMapIframeView();
    };
};