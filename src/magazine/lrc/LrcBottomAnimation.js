// 文件名称: LrcBottomAnimation
//
// 创 建 人: chenshy
// 创建日期: 2015/12/3 19:55
// 描    述: LrcBottomAnimation
(function(){
    //字幕显示模板
    var template =
        "<div style='width: 100%;position: absolute;height: 50%;'>" +
            "<span class='bottom-left-lrc'style='position: absolute;left: 0;z-index: 0;overflow: hidden;word-break:keep-all;white-space:nowrap;'></span>" +
            "<span class='bottom-left-mask-lrc' style='position: absolute;left: 0;z-index: 1;overflow: hidden;word-break:keep-all;white-space:nowrap;'></span>" +
        "</div>" +
        "<div style='width: 100%;position: absolute;height: 50%;bottom: 0;text-align: right'>" +
            "<span class='bottom-right-lrc' style='position: absolute;right: 0;z-index: 0;overflow: hidden;word-break:keep-all;white-space:nowrap;'></span>" +
            "<span class='bottom-right-mask-lrc' " +
        "style='left: 0;z-index: 1;overflow: hidden;word-break:keep-all;white-space:nowrap;position:absolute'></span>" +
        "</div>";

    function LrcBottomAnimation(container,lrcConfig){
        var div = document.createElement("div");
        var style = div.style;
        style.position = "absolute";
        style.width = "100%";
        style.height = "inherit";

        div.innerHTML = template;

        container.appendChild(div);

        var leftSpan = div.querySelector(".bottom-left-lrc");
        var leftMaskSpan = div.querySelector(".bottom-left-mask-lrc");

        leftMaskSpan.style.color = lrcConfig.singing_color;

        var rightSpan = div.querySelector(".bottom-right-lrc");
        var rightMaskSpan = div.querySelector(".bottom-right-mask-lrc");
        rightMaskSpan.style.color = lrcConfig.singing_color;

        var cnt = 2;
        var index = 0;

        return function(text,o,musicPlayer,remove){
            if(remove){
                container.removeChild(div);
            }else{
                var lrc = musicPlayer._lrcPlayer;
                if(index == 2 || index == 0){
                    leftSpan.innerHTML = text;
                    leftMaskSpan.innerHTML = text;
                    //console.log(o.curLine);
                    var nextText = lrc.lines[(o.curLine)] && lrc.lines[(o.curLine)].txt;
                    if(nextText) {
                        rightSpan.innerHTML = nextText;
                        rightMaskSpan.innerHTML = nextText;
                    }else{
                        rightSpan.innerHTML = "";
                        rightMaskSpan.innerHTML = "";
                    }
                    index = 0;

                    leftMaskSpan.style.width = 0;
                    rightMaskSpan.style.width = 0;
                }

                var barMWidth;
                var barNWidth;
                if(index == 0 && text){
                    barMWidth = leftSpan.offsetWidth;
                    barNWidth = barMWidth * (musicPlayer.getTime() * 1000 - o.lines[o.curLine - 1].time) / (o.lines[o.curLine].time - o.lines[o.curLine - 1].time);
                    leftMaskSpan.style.width = barNWidth + "px";
                    $(leftMaskSpan).animate({ width: barMWidth }, o.lines[o.curLine].time - musicPlayer.getTime() * 1000);
                }else if(index == 1 && text){
                    barMWidth = rightSpan.offsetWidth;
                    if(o.lines[o.curLine]){
                        barNWidth = barMWidth * (musicPlayer.getTime() * 1000 - o.lines[o.curLine - 1].time) / (o.lines[o.curLine].time - o.lines[o.curLine - 1].time);
                        rightMaskSpan.style.width = barNWidth + "px";
                        $(rightMaskSpan).animate({ width: barMWidth }, o.lines[o.curLine].time - musicPlayer.getTime() * 1000-100);
                        rightMaskSpan.style.left = rightSpan.offsetLeft + "px";
                    }else{
                        $(rightMaskSpan).animate({ width: barMWidth }, 2000);
                    }
                }

                //console.log(rightSpan.offsetLeft);

                index++;
            }
        }
    }

    window.LrcBottomAnimation = LrcBottomAnimation;
})();