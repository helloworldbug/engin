// 文件名称: ImageSprite_setAttr
//
// 创 建 人: chenshy
// 创建日期: 2015/5/20 18:32
// 描    述: ImageSprite_setAttr
dms.ImageSprite.createObject = function(item, scriptParser){
    var displayObject = new dms.ImageSprite();
//    item.__key_id = ___currentTplData.key_id;
//        console.log("groupid",item.group_id);
//    displayObject.userData = item;
//    ROSetItemId.call(displayObject,item, scriptParser);
    return displayObject;
};

dms.ImageSprite.prototype.resetAttribute = function(){
    dms.RenderObject.prototype.resetAttribute.call(this);
    if(this.userData){
        var item = this.userData;
        var sprite = this;
        var dataFor = item.data_for;
        var type = item.item_type;
        var itemVal = item.item_val;
        var width = ~~item.item_width;
        var height = ~~item.item_height;
        if("15" == type){   //地图的时候，图片链接地址需要拼接
            var jsonObj = JSON.parse(itemVal);
            itemVal = "http://api.map.baidu.com/staticimage/v2?ak=VzFAGGC7tDTFzqKKIsTI7GRV&copyright=1&center=" + jsonObj.lng + "," + jsonObj.lat + "&zoom=" + jsonObj.zoom + "&markers="
                + jsonObj.lng + "," + jsonObj.lat + "&width=" + width + "&height=" + height;

        }
        //全景图，设置首张图片  modify by fishYu  2016-1-20 18：25
        if("40" == type){
            itemVal = itemVal.split("|")[0];
        }
        if(dataFor) {    //图片
            //图片有dataFor值的时候，一些元素的值要重新设置值
            itemVal = this.userProperties.item_val;
            var item1 = this.userProperties;
            width = ~~item1.item_width;
            height = ~~item1.item_height;
            //坐标
            this.left = item1.item_left;
            this.top  = item1.item_top;
            //旋转
            var rotateAngle = item1.rotate_angle;
            this.setRotate(0,0,rotateAngle);
            //缩放
            var scaleX = item1.x_scale;
            var scaleY = item1.y_scale;
            this.setScale(scaleX,scaleY);

        }
        var cntype = item.item_cntype;
        var imgUrl = "";
        //todo 设置一个默认图片
        this.contentElement.src = "data:image/jpg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAIBAQEBAQIBAQECAgICAgQDAgICAgUEBAMEBgUGBgYFBgYGBwkIBgcJBwYGCAsICQoKCgoKBggLDAsKDAkKCgr/2wBDAQICAgICAgUDAwUKBwYHCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgr/wgARCAABAAEDAREAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABUBAQEAAAAAAAAAAAAAAAAAAAAE/9oADAMBAAIQAxAAAABvKH//xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oACAEBAAE/AH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAECAQE/AH//xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oACAEDAQE/AH//2Q==";

//        var style = sprite.element.style;
        if(cntype == 2){ //元素值类型 item_val指示(1-直接内容；2-链接地址；3-资源id)
            imgUrl = itemVal;
        }else if(cntype == 3){
            if(item.__key_id){
                var url = itemVal;
                imgUrl = fmacapi.tpl_res_img_url(item.__key_id,cntype,url);
            }else{
                imgUrl = itemVal;
            }
        }



        if(imgUrl == "" && item.base64ImageData){
            imgUrl = item.base64ImageData;
            //sprite.setImageUrlAndReset(item.get("base64ImageData"));
        }else{
            //sprite.setImageUrl(imgUrl);
        }

        this.imageRect = item.image_rect;
        //console.log(item.image_rect);

//        sprite.width = width;
//        sprite.height = height;
//
        dms.addImageToLoad(sprite,sprite.dmsStage);
        // var wh = "w/"+Math.ceil(width/2)+"/h/"+Math.ceil(height/2);
        /*************************************由excel按照比例决定图片尺寸***********************************************/
        // var wh = "";
        // if(imgUrl.indexOf("png")>=0){
        //     var wh = "w/"+Math.ceil(width*0.1)+"/h/"+Math.ceil(height*0.1);
        // }else{
        //     var wh = "w/"+Math.ceil(width*0.1)+"/h/"+Math.ceil(height*0.1);;
        // }
//        console.log(2);
        var wh = "w/"+Math.ceil(width*1.0)+"/h/"+Math.ceil(height*1.0);
        if(imgUrl.indexOf("data:") <0){                 //如果不是base64图片加上参数
			if(imgUrl.indexOf("imageMogr2/")>=0){	//新的图片裁剪格式
				
			}else{
				if(imgUrl.indexOf("w/")>=0){
					imgUrl = imgUrl.replace(/(w\/)([0-9]+)(\/h\/)([0-9]+)/g, wh);
				}else{
					if(imgUrl.indexOf("imageView")>=0){
						imgUrl = imgUrl+"/"+wh;
					}else{
						imgUrl = imgUrl+"?imageView2/2/"+wh;
					}
				}
			}
        }

//       console.log(imgUrl,"dddddddddd");
        sprite.image = (imgUrl);
        sprite.setContentWidth(width);
        sprite.setContentHeight(height);

        if(item.group_id > 0){
//            console.log(imgUrl);
        }
//
//        var scaleX = item.x_scale;
//        var scaleY = item.y_scale;
//
//        if(width && height){
//            width = width * scaleX;
//            height = height * scaleY;
////            sprite.setSpriteSize(width,height);
////            sprite.width = width;
////            sprite.height = height;
//            sprite.setImageWidth(width);
//            sprite.setImageHeight(height);
////            style.backgroundSize = "100% 100%";
//        }else{
////            sprite.setSpriteScale(scaleX,scaleY);
//            sprite.scaleX = scaleX;
//            sprite.scaleY = scaleY;
//        }
//
////        style.backgroundRepeat = "no-repeat";
//
////        console.log(x,y);
//
////        sprite.x = x;
////        sprite.y = y;
//
    }
};
