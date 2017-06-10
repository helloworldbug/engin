// 文件名称: ObjectManager
//
// 创 建 人: chenshy
// 创建日期: 2016/4/3 11:56
// 描    述: ObjectManager
dms.ObjectManager = {
    o: {},
    setObj: function(key,value){
        if(!this.o)this.o = {};
        this.o[key] = value;
    },
    getObj: function(key){
        key = key + "";
        if(key.indexOf("cyan") == -1){
            key = "cyan_" + key;
        }
        return this.o[key];
    },
    clear: function(){
        this.o = null;
    }
};