// 文件名称: dms.ImageLoader
//
// 创 建 人: chenshy
// 创建日期: 2015/6/12 21:21
// 描    述: 图片加载器
dms.ImageLoader = {
    imageBuffer : {}
};

dms.ImageLoader.getImage = function(img, fun) {
    if ( typeof img == 'string') {
        if (dms.ImageLoader.imageBuffer[img]) {
            fun(dms.ImageLoader.imageBuffer[img]);
        } else {
            var self = this;
            var myImage = new Image();
            myImage.onload = function(e) {
//                dms.ImageLoader.imageBuffer[img] = myImage;
                fun(myImage);
            };
            myImage.src = img;
            myImage.onerror = function(){
                fun(null);
            };
        }
        return img;
    } else if ( typeof img == 'object') {
//        dms.ImageLoader.imageBuffer[img.src] = img;
//        fun(dms.ImageLoader.imageBuffer[img.src]);
        fun(img);
        return img.src;
    }
};