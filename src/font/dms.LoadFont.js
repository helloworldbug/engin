// 文件名称: LoadFont
//
// 创 建 人: fishYu
// 创建日期: 2016/7/15 15:05
// 描    述: 加载字体对象
(function(dms){
    var LoadFont = function(){
        this.AllCounts  =  3;      //总请求次数
    };
    var p = LoadFont.prototype;
    /**
     * 请求加载字体
     * @param fontServer
     * @param fontFamily
     * @param text
     * @param f
     * @param callback
     */
    p.queryFont  =  function (fontServer,fontFamily,  text, f, callback){
        var self = this;
        fmacapi.cfs_loadfont(fontServer, 'fixed', fontFamily, text, function(fontObj){
              if(callback){
                  callback(fontObj, text, fontFamily, f, fontServer)
              }
        },function(err){
            console.log(err);
            if(self.AllCounts > 0){
                self.queryFont(fontServer,fontFamily,  text, f, callback);
                self.AllCounts--;
            }else{
                self.AllCounts = 3;
            }
        });
    };

    dms.LoadFont = LoadFont;
})(dms);