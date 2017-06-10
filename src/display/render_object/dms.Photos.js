// 文件名称: dms.Photos
//
// 创 建 人: fishYu
// 创建日期: 2015/12/28 17:40
// 描    述: 图集
dms.Photos = function(){
    dms.RenderObject.call(this);
//    var el = this.element;
//    el.style.overflow = "hidden";
};

dms.inherit(dms.Photos,dms.RenderObject);

dms.Photos.prototype.initSwipe = function () {
    var self = this;
    if(!this._photosSwipe){
        this._photosSwipe = new dms.PhotoSwipe(this.contentElement, this.userData, function () { 
            self.onShow();            
        });
    }else{
        return;
    }
};
/**
 * 图集重新监听点击事件
 */
dms.Photos.prototype.addListener = function(){
    var self = this;
    this.onClick = function(e){
        e.preventDefault();
        e.stopPropagation();
        var target = e.target;
        var dataIndex = target.getAttribute("data-index");
        dataIndex = parseInt(dataIndex);
        if(self.photosSwipeEventsList && self.photosSwipeEventsList.length > 0){
            if(self.photosSwipeEventsList[dataIndex]){
                //TODO 图集的事件只能是meTap
                var arr = self.photosSwipeEventsList[dataIndex].meTap;
                for(var i = 0;i < arr.length;i++){
                    var o = arr[i];
                    if(dms.ActList[o.type]){
                        dms.ActList[o.type](o.param);
                    }
                }
            }
        }
    };
};
/**
 *点击重新显示的事件时候，回调方法。
 */
dms.Photos.prototype.onShow = function () {
    var self = this;
    if (self._photosSwipe) {
        self._photosSwipe.myPhotosSwipe && self._photosSwipe.myPhotosSwipe.setAutoTime(2000);
        self._photosSwipe.myPhotosSwipe && self._photosSwipe.myPhotosSwipe.play();
    }
};