// 文件名称: LrcSliderLeftAnimation
//
// 创 建 人: guYY
// 创建日期: 2015/12/9 20:52
// 描    述: LrcSliderLeftAnimation
(function(){
    function LrcSliderLeftAnimation(container,lrcConfig){
        //歌词1容器
        var lrcCon1 = document.createElement("div");
        var lrcCon2 = document.createElement("div");
        var style1 = lrcCon1.style;
        var style2 = lrcCon2.style;
        style1.width = "100%";
        style1.position = "absolute";
        style1.textAlign = "center";
        style1.top = 0;
        style2.width = "100%";
        style2.position = "absolute";
        style2.textAlign = "center";
        var lines;
        container.appendChild(lrcCon1);
        container.appendChild(lrcCon2);
        //文字大小
        var size = parseInt(lrcConfig.font_size);
        //容器高
        var height = container.clientHeight;
//        console.log(height-size);
        style2.top = (height-size)+"px";


        return function(text,o,musicPlayer,remove){
            if(!remove){
                if(lines != o.lines) {
                    lines = o.lines;
                }
                lrcCon1.innerHTML = lines[o.curLine-1].txt;
                lrcCon2.innerHTML = lines[o.curLine].txt;
                lrcCon1.className = "clipLeftLrc";
                lrcCon2.className = "clipLeftLrc";
//                console.log("当前行="+ o.curLine+"："+ lines[o.curLine-1].txt);
            }else{
                lines = null;
            }
        }
    }

    window.LrcSliderLeftAnimation = LrcSliderLeftAnimation;
})();