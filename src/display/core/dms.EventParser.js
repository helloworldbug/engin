// 文件名称: dms.EventParser
//
// 创 建 人: chenshy
// 创建日期: 2016/4/7 9:18
// 描    述: dms.EventParser
(function (dms) {

    //meTap、meLongTap、meSwipeLeft、meSwipeRight、meSwipeUp、meSwipeDown
    function check(itemHref) {
        //modify by fishYu 2016-5-5 18:06       兼容所有传输错误交互事件
        if (itemHref == "none") {
            return "";
        }
        var arr = itemHref.split("|");
        var str = "";
        for (var j = 0; j < arr.length; j++) {
            var temp = arr[j];
            //modify by fishYu 2016-4-14 16：00只是跳页的时候根据页ID来跳页需要转换成字符串
            if (temp.indexOf("pageto") > -1) {
                var k = temp.split(':');
                temp = k[0] + ":'" + k[1] + "'";
            }
            str += "{" + temp + "}" + ",";
        }
        str = str.substring(0, str.length - 1);
        return str;
    }

    function getActs(json) {
        json = dms.toJSON(json);
        var arr = [];
        for (var i = 0; i < json.length; i++) {
            //if(json.hasOwnProperty(key)){// in json
            var obj = json[i];
            for (var key in obj) {
                var v = obj[key];
                var o = {
                    type: key,
                    param: v
                };
                arr.push(o);
            }
        }

        return arr;
    }

    dms.EventParser = function (str) {
        var strLen = str.length;
        var obj, j;
        var eventList = {

        };

        if (str.indexOf("[") == 0 && str.lastIndexOf("]") == strLen - 1) {
            obj = dms.toJSON(str);

            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                for (var key in o) {
                    eventList[key] = eventList[key] || [];
                    var str1 = o[key];
                    if (dms.isObject(str1)) {//if(str1.indexOf("{") == 0 && str1.lastIndexOf("}") == str1.length - 1){

                        //str1 = dms.toJSON(str1);

                        if (str1.target) {
                            eventList[key].push({
                                type: 'open_link',
                                param: { target: str1.target, url: str1.value }
                            });
                        }
                    } else {
                        //modify by fishYu 2016-9-19 9:19
                        //[{telto:'021-35435463'}]   ---> [{telto:'021-35435463'}]  防止dms.toJSON的时候021-35435463进行计算了
                        if (str1.indexOf('telto') > -1) {
                            str1 = str1.substring(0, 6) + "'" + str1.substring(6, str1.length) + "'";
                        }
                        str1 = "[" + check(str1) + "]";
                        var arr = getActs(str1);
                        eventList[key] = eventList[key].concat(arr);
                    }
                }
            }
        } else {
            //modify by fishYu 2016-4-8 15:31 只是提交按钮的时候
            if (str == "submit") {
                eventList.meTap = [{ "type": "submit", "param": "submit" }];
            } else if (str.indexOf("http") > -1) {
                eventList.meTap = [{ "type": 'open_link', "param": { "target": "_self", "url": str } }];
            } else {
                str = check(str);
                str = "[" + str + "]";
                eventList.meTap = getActs(str);
            }
        }
        return eventList;
    };

    dms.AnimateEndActParser = function (str) {
        var strLen = str.length;
        var obj, j;
        var successList = [];
        var errorList = [];
        var eventList = {};
        var animationEndActList = [];
        //TODO 执行animate_end_act的脚本事件都是meTap类型
        if (str.indexOf("[") == 0 && str.lastIndexOf("]") == strLen - 1) {
            obj = dms.toJSON(str);
            for (var i = 0; i < obj.length; i++) {
                var o = obj[i];
                for (var key in o) {
                    eventList[key] = eventList[key] || [];
                    var str1 = o[key];

                    if (dms.isObject(str1)) {
                        if (str1.target) {
                            eventList[key].push({
                                type: 'open_link',
                                param: { target: str1.target, url: str1.value }
                            });
                        }
                    } else {
                        str1 = "[" + check(str1) + "]";
                        var arr = getActs(str1);
                        eventList[key] = eventList[key].concat(arr);
                    }
                }
            }
            animationEndActList = eventList.meTap;
        } else {
            if (str.indexOf("{") == 0 && str.lastIndexOf("}") == strLen - 1) {
                obj = dms.toJSON(str);
                var s = obj.success;
                s = check(s);
                s = "[" + s + "]";
                successList = getActs(s);
                s = obj.error;
                for (var i = 0; i < s.length; i++) {
                    var s1 = s[i];
                    s1 = check(s1);
                    s1 = "[" + s1 + "]";
                    errorList[i] = getActs(s1);
                }
            } else {
                str = check(str);
                str = "[" + str + "]";
                animationEndActList = getActs(str);
            }
        }
        return {
            actList: animationEndActList,
            success: successList,
            error: errorList,
            errorCount: 0
        };
    }
})(dms);