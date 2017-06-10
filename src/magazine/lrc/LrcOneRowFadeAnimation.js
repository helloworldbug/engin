// 文件名称: LrcOneRowFadeAnimation
//
// 创 建 人: guYY
// 创建日期: 2015/12/10 17:95
// 描    述: 单行显示歌词-淡入淡出
(function(){
    function LrcOneRowFadeAnimation(container,lrcConfig){
        //歌词1容器
        var lrcCon = document.createElement("div");
        lrcCon.style.position = "absolute";
        lrcCon.style.top = "100%";
        lrcCon.style.textAlign = "center";
        lrcCon.style.width = "100%";
        lrcCon.style.height = lrcConfig.font_size+"px";
        lrcCon.style.fontSize =lrcConfig.font_size+"px";
        lrcCon.style.webkitTransform = "translateY(-100%)";
        lrcCon.style.transform = "translateY(-100%)";
        lrcCon.className = "fadeLrc";
        container.appendChild(lrcCon);
        var lines;
        return function(text,o,musicPlayer,remove){
            if(!remove){
                if(lines != o.lines) {
                    lines = o.lines;
                }
                if(text != "") {
                    lrcCon.style.display = "none";
                    lrcCon.innerHTML = text;
                    setTimeout(function(){
                        lrcCon.style.display = "block";
                    },20);
//                    lrcCon.style.display = "block";
//                    console.log("当前行=" + o.curLine + "：" + text);
                }
            }else{
                lines = null;
            }
        }
    }

    window.LrcOneRowFadeAnimation = LrcOneRowFadeAnimation;
})();