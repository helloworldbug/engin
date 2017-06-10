// 文件名称: RedEnvelopes
//
// 创 建 人: fishYu
// 创建日期: 2016/1/19 17:01
// 描    述: 红包按钮
dms.RedEnvelopes = function(image,width,height){
    dms.ImageSprite.call(this,image,width,height);
};

dms.inherit(dms.RedEnvelopes,dms.ImageSprite);

//销毁
dms.RedEnvelopes.prototype.destroy = function(){
    dms.ImageSprite.prototype.destroy.call(this);
};

/**
 * 红包添加事件
 */
dms.RedEnvelopes.prototype.addListener = function(){
    var self = this;
    if(!self.itemHref) return;
    if(window.app && window.app.VERSION){
        return;
    }else{
        this.onClick = function(e){
            e.stopPropagation();
            e.preventDefault();
            var testRedEnvelopes = self.redEnvelopesInfo;
            //添加正式还是测试服
            testRedEnvelopes.fmawr = fmawr || "0";
            testRedEnvelopes.envelopesId = envelopesId || "";   //红包ID
            //TODO 存储本地localstorage
            window.localStorage.tpl_red_envelopes_info = JSON.stringify(testRedEnvelopes);
            //            window.location.href = itemHref;
            //在app内部的时候
            if(window.app && window.app.VERSION){
                window.open(self.itemHref, '_blank');	//内部浏览器打开
            }else{
                window.location.href = self.itemHref;
            }
        };
    }
};