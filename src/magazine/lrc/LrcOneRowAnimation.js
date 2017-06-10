// 文件名称: LrcOneRowAnimation
//
// 创 建 人: guYY
// 创建日期: 2015/12/10 12:10
// 描    述: 单行显示歌词-滚动输出
(function(){
    function LrcOneRowAnimation(container,lrcConfig){
        //歌词1容器
        var lrcCon = document.createElement("div");
//        lrcCon.className = "animated fadeIn";
        lrcCon.style.position = "absolute";
        lrcCon.style.top = "100%";
        lrcCon.style.textAlign = "center";
        lrcCon.style.width = "100%";
        lrcCon.style.height = lrcConfig.font_size+"px";
        lrcCon.style.webkitTransform = "translateY(-100%)";
        lrcCon.style.transform = "translateY(-100%)";
        lrcCon.className = "clipLeftLrc";
        container.appendChild(lrcCon);
        var lines;
        //文字大小
        var size = parseInt(lrcConfig.font_size);
        //容器高
        var height = container.clientHeight;
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

    window.LrcOneRowAnimation = LrcOneRowAnimation;
})();