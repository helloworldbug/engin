// 文件名称: Animation_Parser
//
// 创 建 人: chenshy
// 创建日期: 2015/5/21 9:58
// 描    述: Animation_Parser
/**
 * 动画解析函数
 * @param displayObject 显示对象
 * @param animationName 动画名或类名
 * @param animationVal 动画参数
 * @constructor
 */
(function(dms){

//    function setAnimation(displayObject,name,params){
//        if(animationName){
//            dms.Css.addClass(el,animationName + " animated");
////        displayObject.addClass();
//        }
//
//        //解析动画参数
//        if (params) {
//            var style = el.style;
//            var delay = 0.3;
//            //延迟时间
//            if (params.delay) {
//                delay = parseFloat(params.delay) + delay;
//            }
//
//            style["WebkitAnimationDelay"] = (delay) + "s";
//            style["animationDelay"] = (delay) + "s";
//            //动画持续时间
//            if (params.duration) {
//                style["WebkitAnimationDuration"] = params.duration + "s";
//                style["animationDuration"] = params.duration + "s";
//            }
//            //动画次数
//            if (params.infinite) {
//                style["WebkitAnimationIterationCount"] = params.infinite;
//                style["animationIterationCount"] = params.infinite;
//            }
//        }
//    }

    dms.ParseAnimation = function(displayObject,animationName,animationVal){
        var el = displayObject.contentElement;
        //return;

        var filters = ["blurALittle"];

        //"fadeInUpBig","scaleInToSmall","fadeInLeft","fadeInRight",
        //    "fadeInUp","fadeInDownBig","fadeIn","fadeInDown","zoomIn","none",

        if(filters.indexOf(animationName) != -1) {
            return;
        }

        animationName = animationName + "";
        var params;
        if(animationName.indexOf("[") == 0 && animationName.indexOf("]") == animationName.length - 1){
            var anis = dms.toJSON(animationName);
            params = [];
            if (animationVal != "undefined" && animationVal) {
                params = dms.toJSON(animationVal);
            }

            displayObject._animationNames = anis;
            displayObject._animationVals = params;

            displayObject.playCSSAnimation(0);
        }else{

            if (animationVal != "undefined" && animationVal) {
                params = dms.toJSON(animationVal);
            }
            displayObject._animationNames = [animationName];
            displayObject._animationVals = [params || {}];
            displayObject.playCSSAnimation(0);
            //setAnimation(displayObject,animationName,params);
        }
    };
})(dms);