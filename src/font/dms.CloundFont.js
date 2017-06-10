// 文件名称: CloundFont
//
// 创 建 人: chenshy
// 创建日期: 2015/5/28 10:24
// 描    述: CloundFont
dms.CloundFont = {
    loadedMap : null,
    callback : null,
    fontPrefix : "css-font-",
    loadFont : function(text,fontFamily, loadEnd){
        if(this.loadedMap == null){
            this.loadedMap = {};
        }
        this.loadEnd = loadEnd || function () { };
        // text = text.replace(/\n|\&|<br\/>|<br>/g, "");
        //去掉对&的过滤，
        text = text.replace(/\n|<br\/>|<br>/g,"");
        //modify by fishYu 2016-8-24 16:48 传输的文字去重
        var textArr = text.split("");   //转换成数组
        textArr = this.uniqueArray(textArr);
        text = textArr.join("");
        var f = this._checkExistFont(text,fontFamily);
        if(f){
//            console.log("f",f);
            return f;
        }else{
            f = this.fontPrefix + dms.getNewID();
        }



//        console.log(text);
        var fontServer = dms.fontServer;
        fontServer = (!fontServer ? "http://agoodme.com:3000" : fontServer);
        var self = this;
//        console.log(fontServer)
//        fmacapi.cfs_loadfont(fontServer, 'fixed', fontFamily, text, function(fontObj){
////            console.log(f,fontObj);
//            if(fontObj.src == 'undefined' || !fontObj.src){
//
//            }else{
//                var fontName = f;
//                self.loadedMap[text + "-" + fontFamily] = fontName;
////                console.log(f);
//                self._applyFont(fontName,fontServer + fontObj.src,fontObj.type);
//            }
//        },function(){
//
//        });
        var loadFont = new dms.LoadFont();
        loadFont.queryFont(fontServer,fontFamily,  text, f, self.queryFontEnd.bind(self));
        return f;
    },
    queryFontEnd : function (fontObj, text,fontFamily, f, fontServer){
        var self = this;
        if(fontObj.src == 'undefined' || !fontObj.src){

        }else{
            var fontName = f;
            self.loadedMap[text + "-" + fontFamily] = fontName;
            self._applyFont(fontName,fontServer + fontObj.src,fontObj.type);
        }
        
    },
    _applyFont: function (fontName, src, type) {
        var self = this;
        var styleNode = document.createElement("style");
        styleNode.type = "text/css";
        styleNode.id = "style-" + fontName;
        var styletext = "";
        styletext += "@font-face {\n";
        styletext += "  font-family: '" + fontName + "';\n";
        styletext += "  src: url('" + src + "') format('" + type + "');\n";
        styletext += "}\n";
        styleNode.innerHTML = styletext;
        document.head.appendChild(styleNode);
        //modify by fishYu 2016-9-22 11:12 增加对字体加载完成的回调
        window.FontFaceOnload(fontName, {
            success: function () {
                if (self.loadEnd && typeof self.loadEnd == "function" ) self.loadEnd();
            }
        });
        
    },
    _checkOver : function(){
        if(this.loadedCount <= 0){
            this.loadedCount = 0;
            if(this.callback){
                this.callback();
                this.callback = null;
            }
        }
    },

    _checkExistFont : function(text,font){
        var tempText = text.replace(/\n/g,'');
        var map = this.loadedMap;
        for(var key in map){
            if((key.indexOf(tempText) != -1 && key.indexOf(font) != -1)){
                return map[key];
            }
        }
        return false;
    },

    /**
     * 支持多字体加载方法
     * @param arr [{fontFamily:"",text:""}]
     * @param cb
     */
    loadFonts : function(arr,cb){
        this.callback = cb;

        var i;

        var map = this.loadedMap,font,tempText;
//            console.log(arr);

        //去除默认字体
//            if(fontFamily == '兰亭细黑' || fontFamily.toLowerCase() == 'microsoft yahei'){
//                return '兰亭细黑';
//            }

        for(i = arr.length - 1;i >= 0;i--){
            font = arr[i];
            if(font.fontFamily == '兰亭细黑' || font.fontFamily.toLowerCase() == 'microsoft yahei'){
                arr.splice(i,1);
            }
        }

        //查找文字字体是否已经加载过
        for(i = arr.length - 1;i >= 0;i--){
            font = arr[i];
            tempText = font.text.replace(/\n/g,'');
            for(var key in map){
                if((key.indexOf(tempText) != -1 && key.indexOf(font.fontFamily) != -1) || font.fontFamily == '兰亭细黑'){
                    arr.splice(i,1);
                }
            }
        }
        //console.log(arr);

        if(arr.length == 0){
            if(this.callback){
                this.callback();
                this.callback = null;
            }
            return;
        }

        //合并相同字体
        arr = this.unique(arr);

        this.loadedCount = arr.length;

        for(i = 0;i < arr.length;i++){
            this.loadFont(arr[i].text,arr[i].fontFamily);
        }
    },
    unique : function(arr) {
        var result = [], hash = {};
        var ele2;
        for (var i = arr.length - 1, elem; i>= 0; i--) {
            elem = arr[i];
            if (!hash[elem.fontFamily]) {
                result.push(elem);
                hash[elem.fontFamily] = elem;
            }else{
                ele2 = hash[elem.fontFamily];
//                    ele2.text += elem.text;
                if(ele2.text.length + elem.text.length > 100 ){
                    result.push(elem);
                    hash[elem.fontFamily] = elem;
                }else{
                    ele2.text += elem.text;
                }

            }
        }
        return result;
    },
    clearFont : function(){
        if(this.loadedMap){
            var fontName;
            for(var key in this.loadedMap){
                fontName = this.loadedMap[key];
                var dom = document.getElementById("style-" + fontName);
                if(dom && dom.parentNode){
                    dom.parentNode.removeChild(dom);
                }
            }
        }
        this.loadedMap = null;
    },
    //去除重复的数组
    uniqueArray : function (data){
        data = data || [];
        var result = [], hash = {};
        for (var i = 0, elem; (elem = data[i]) != null; i++) {
            if (!hash[elem]) {
                result.push(elem);
                hash[elem] = true;
            }
        }
        // result.sort();
        return result;
    }
};
