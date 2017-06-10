// 文件名称: mUtils
//
// 创 建 人: chenshy
// 创建日期: 2016/3/21 10:21
// 描    述: mUtils
window.mUtils = function(){
    var type2s = [31];
    var o = {
        /**
         * 获取切换类型 1.原始 2.横向纵向
         * @param data
         * @returns {number}
         */
        getSwitchType: function(data){
            var type;
            if(data && (type = data.tpl_type)){
                for(var i = 0; i < type2s.length; i++){
                    if(type === type2s[i]){
                        return 2;
                    }
                }
            }
            return 1;
        },
        limitNum: function(index,len){
            if(index < 0){
                index = len + index;
            }else if(index > len - 1){
                index = index - len;
            }

            if(index < 0){
                index = 0;
            }else if(index > len - 1){
                index = len - 1;
            }

            return index;
        }
    };

    return o;
}();