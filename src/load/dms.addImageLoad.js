// 文件名称: AddImageLoad
//
// 创 建 人: chenshy
// 创建日期: 2015/6/11 14:56
// 描    述: AddImageLoad
dms.addImageToLoad = function(sprite,dmsStage){
    dmsStage = dmsStage || sprite.dmsStage;
    dmsStage.pageLoadManager.addLoad(sprite);

//    console.log(sprite.addEventListener);
    var loadFn = function(){
        dmsStage.pageLoadManager.removeLoad(sprite);
//        console.log(sprite.image);
//            console.log("remove");
        sprite.removeEventListener(dms.IMAGE_LOADED,loadFn);
        sprite.removeEventListener(dms.IMAGE_LOAD_ERROR,loadErrorFn);
    };

    var loadErrorFn = function(){
        dmsStage.pageLoadManager.removeLoad(sprite);
        sprite.removeEventListener(dms.IMAGE_LOAD_ERROR,loadErrorFn);
    };

//    console.log(sprite);
    sprite.addEventListener(dms.IMAGE_LOAD_ERROR,loadErrorFn);
    sprite.addEventListener(dms.IMAGE_LOADED,loadFn);
};