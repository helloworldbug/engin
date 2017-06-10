// 文件名称: InfiniteChallenge
//
// 创 建 人: fishYu
// 创建日期: 2016/1/23 16:05
// 描    述: 无限回答----等同密码只是可以无限次回答
dms.InfiniteChallenge = function(){
    this._challengeTxt = document.createElement("input");
    this._challengeBtn = document.createElement("label");
    dms.RenderObject.call(this);
    this.contentElement.appendChild(this._challengeTxt);
    this.contentElement.appendChild(this._challengeBtn);
};

dms.inherit(dms.InfiniteChallenge,dms.RenderObject);

dms.InfiniteChallenge.prototype._checkOK = function(checkTxt, endScript){
    var self = this;
    var inputTxt = this._challengeTxt.value;
    var successScript = "";
    var errorScript = "";
    /**
     * endScript = {success:"show_el:1|hide_el:2", error:"show_el:2|hide_el:3"}
     */
    //重新拆分脚本，成功脚本，失败脚本
    if(endScript && endScript.indexOf("success") > -1 && endScript.indexOf("error") > -1){
        try{
            var endScriptJson = JSON.parse(endScript);
            successScript = endScriptJson.success;
            errorScript = endScriptJson.error;
        }catch(e){
            console.log(e);
        }
    }
    if(checkTxt == inputTxt){
        if(successScript){  //成功执行的脚本
            dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",successScript));
        }
    }else{
        if(errorScript){    //执行错误脚本
            dms.dispatcher.dispatchEvent(dms.createEvent("countdown:over",errorScript));
        }
    }
};

dms.InfiniteChallenge.prototype.destroy = function(){
    dms.RenderObject.prototype.destroy.call(this);
    this.checkTxt = "";
    this.endScript = "";
};

dms.InfiniteChallenge.prototype.addListener = function(){
    var self = this;
    $(this._challengeBtn).on(dms.getEventName(), function(e){
        e.stopPropagation();
        e.preventDefault();
        self._checkOK(self.checkTxt, self.endScript)
    });
}