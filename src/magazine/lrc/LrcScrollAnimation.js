// 文件名称: LrcScrollAnimation
//
// 创 建 人: chenshy
// 创建日期: 2015/12/3 19:56
// 描    述: LrcScrollAnimation
(function(){
    function LrcScrollAnimation(container,lrcConfig){
        var div = document.createElement("div");
        var style = div.style;

        style.width = "100%";
        style.position = "absolute";
        style.textAlign = "center";

        var lines;
        container.appendChild(div);

        var size = parseInt(lrcConfig.font_size);

        var height = container.clientHeight;

        var divHeight = size + 3;

        var tHeight = size / 2 + divHeight;

        var count = parseInt(height / tHeight);
        var sh = height * 1.0 / count;

        //console.log(count,sh);

        var middleY = parseInt(count / 2) * sh;
//        console.log("####="+height,tHeight,middleY,sh,count);
        //var cnt = parseInt(height / size);
        //var s = height % size;
        //
        //var m = s / (cnt-2);
        //
        //m += (size / 2);

        //console.log(cnt,s,m);

        return function(text,o,musicPlayer,remove){
            if(!remove){
                if(lines != o.lines){
                    lines = o.lines;
                    var html = "";
                    style.top = middleY + "px";
                    for(var i = 0;i < lines.length;i++){
                        var line = lines[i];
//                        if(line.txt != "") {
                            html += "<div style='margin:0 auto;'><span style='text-align:center;overflow: hidden;word-break:keep-all;line-height: " + lrcConfig.font_size + "'>" + line.txt +
                                "</span>" +
                                "<span style='width:0px;overflow: hidden;word-break:keep-all;text-align:center;line-height:" + lrcConfig.font_size + ";" +
                                "white-space:nowrap;position: absolute;z-index: 1;color:" +
                                lrcConfig.singing_color + "'>" + line.txt +
                                "</span></div>";
//                        }
                    }
                    div.innerHTML = html;
                }else{

                    //$(div).animate({top:middleY},200);
                }

                if(o.curLine == 1){
                    var preDiv = $(div).children("div")[o.lines.length - 1];
                    preDiv = $(preDiv);
                    var preSpan = preDiv.find("span")[1].style.opacity = 0;
                }

                if(o.curLine - 2 >= 0){
                    var preDiv = $(div).children("div")[o.curLine - 2];
                    preDiv = $(preDiv);
                    var preSpan = preDiv.find("span")[1].style.opacity = 0;

                    //preDiv = $(div).children("div")[o.curLine + 1];
                    //preDiv = $(preDiv);
                    //var preSpan = preDiv.find("span")[1].style.opacity = 0;
                }

                var sdiv = $(div).children("div")[o.curLine - 1];
                var c = $(sdiv).find("span");
                var span1 = c[0];
                var span2 = c[1];

                var left = span1.offsetLeft;
                var top = span1.offsetTop;
                //span2.width = 0;
                span2.style.opacity = 1;
                span2.style.left = left + "px";
                span2.style.top = top + "px";

                var barMWidth;
                var barNWidth;

                if(o.lines[o.curLine]){
                    barMWidth = span1.offsetWidth;
                    //console.log(barMWidth);
                    barNWidth = barMWidth * (musicPlayer.getTime() * 1000 - o.lines[o.curLine - 1].time) / (o.lines[o.curLine].time - o.lines[o.curLine - 1].time);
                    span2.style.width = barNWidth + "px";
                    $(span2).animate({ width: barMWidth }, (o.lines[o.curLine].time - musicPlayer.getTime() * 1000)/2);
//                    $(span2).animate({ width: barMWidth },o.lines[o.curLine].time - musicPlayer.getTime() * 1000);;

                }else{
                    barMWidth = span1.offsetWidth;
                    $(span2).animate({ width: barMWidth }, 2000);
                }
//                $(div).animate({top:middleY - (o.curLine - 1) * sh},200);//
//                console.log("******************************************************************************");
//                console.log(o.curLine+"行，内容="+span2.innerHTML+".height="+span1.offsetHeight+".top="+top);
//                console.log((middleY - top)+","+divHeight+","+sh);
                $(div).animate({top:middleY - top},200);
//                $(div).animate({top:middleY - (o.curLine - 1) * divHeight},200);
            }else{
                lines = null;
            }
        }
    }

    window.LrcScrollAnimation = LrcScrollAnimation;
})();