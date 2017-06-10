// 文件名称: dms.PanoramicPhoto
//
// 创 建 人: guYY
// 创建日期: 2016/1/6 13:55
// 描    述: 全景图
dms.PanoramicPhoto = function(image,width,height){
    dms.ImageSprite.call(this,image,width,height);
};

dms.inherit(dms.PanoramicPhoto,dms.ImageSprite);


dms.PanoramicPhoto.prototype.addEvent = function(){
    var self = this;
    this.contentElement.addEventListener("touchstart",function(e){
        e.stopPropagation();
        e.preventDefault();
        var touch = e.originalEvent ? e.originalEvent.changedTouches[0] : e.touches[0];
        self.startPosX = touch.clientX;
        self.startPosY = touch.clientY; //记录是否滑页
        self.manuallyStart = true;
        self.lastToLeft = 0;
    });
    this.contentElement.addEventListener("touchmove",function(e){
        e.stopPropagation();
        e.preventDefault();
        var touch = e.changedTouches ? e.changedTouches[0] : e.touches[0];
        var posX = Math.floor(touch.clientX);
        var posY = Math.floor(touch.clientY);
        if(posX < self.minLeft)
            posX = self.minLeft;
        if(posX > self.maxLeft)
            posX = self.maxLeft;
        var d = new Date();
        self.changeImgSrc(self.startPosX-posX);
        self.lastToLeft = self.startPosX-posX;
        self.startPosX = posX;
        self.moveTime = d.getTime();
    });
    this.contentElement.addEventListener("touchend",function(e){
        var touch = e.changedTouches ? e.changedTouches[0] : e.touches[0];
        var posX = Math.floor(touch.clientX);
        var posY = Math.floor(touch.clientY);
        if(Math.abs(posY - self.startPosY) > 100){
//            console.log("翻页");
        }
        var d = new Date();
        self.endTime = d.getTime();
        self.manuallyStart = false;
        var speed  = self.endTime-self.moveTime;
        if(speed < 20) {
            self.lastNum = (20 - speed)*2;
            self.spinningSpeed = 10;
//            self.inertiaChange();  //暂不用惯性
        }
        e.stopPropagation();
        e.preventDefault();
    });
}
//左移多少>0表示左移 =0不动 <0表示右移
dms.PanoramicPhoto.prototype.changeImgSrc = function(toLeft){
    var self = this;
    if(toLeft == 0)return;
    if(toLeft > 0)
        self.showIndex ++;
    else
        self.showIndex --;
    if(self.showIndex  < 0)
        self.showIndex  = self.bgArr.length-1;
    else if(self.showIndex > self.bgArr.length-1)
        self.showIndex = 0;
    this.contentElement.src = self.getHref(self.showIndex);
}
//根据时间惯性转
dms.PanoramicPhoto.prototype.inertiaChange = function(){
    var self = this;
    if(self.manuallyStart || self.lastToLeft == 0 || self.lastNum <= 0)return;
//    console.log("惯性转"+self.lastNum+"@@@"+new Date().getTime());
    self.lastNum--;
    self.changeImgSrc(self.lastToLeft);
    setTimeout(self.inertiaChange(),10+self.spinningSpeed); //todo 此处计时器似乎无效
}
//获取加载索引转-1，获取指定索引 转索引值
dms.PanoramicPhoto.prototype.getHref = function(i){
    i = i < 0 ? this.reLoadIndex : i;
    return this.bgArr[i];
}
//加载所有图片
dms.PanoramicPhoto.prototype.loadImg = function(){
    var self = this;
    while(this.reLoadIndex < this.bgArr.length) {
        self.reLoad();
        this.reLoadIndex++;
    }
}
//所有图片预加载
dms.PanoramicPhoto.prototype.reLoad = function(){
    var self = this;
    var img = document.createElement("img");
    img.src = this.getHref(-1);
    img.onload = function(){
        self.reLoadEdNum++;
        if(self.reLoadEdNum >= self.bgArr.length){
//            console.log("图片列表加载结束!");
        }
    }
}
//销毁
dms.PanoramicPhoto.prototype.destroy = function(){
    dms.ImageSprite.prototype.destroy.call(this);
};

