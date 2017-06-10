// 文件名称: ObjectConfig
//
// 创 建 人: chenshy
// 创建日期: 2015/6/15 17:58
// 描    述: ObjectConfig
/**
 * 对象类型-->对象 映射配置
 * @type {{}}
 */
dms.ObjectConfig = {
    /**图片**/
    "1" : dms.ImageSprite,
    "18" : dms.ImageSprite,
    /**文本**/
    "2" : dms.Text,
    "11": dms.Text,
	/**电话**/
    "12": dms.PhoneText,
	/**邮件**/
    "13": dms.MailText,
	/**输入**/
    "14": dms.InputText,
	/**地图**/
	"15": dms.Map,
    /**水印**/
    "3" : dms.WaterMark,
    /**动画**/
    "4" : dms.AnimateSprite,
    /**路径**/
    "5" : null,
    /**填充区**/
    "6" : null,
    /**音频**/
    "7" : dms.Audio,
    /**视频**/
    "8" : dms.Video,
    /**掩码**/
    "9" : null,
    "10" : dms.PicFrame,
    "17" : dms.MultiFrame,
    /*表单按钮*/
    "19" : dms.Button,
    /*单选框*/
    "20" : dms.Radio,
    /*多选框*/
    "21" : dms.MultiSelect,
    /*投票*/
    "22" : dms.Vote,
    /*涂抹*/
    "24" : dms.Clip,
    /*长按*/
    "25" : dms.LongPress,
    /*字中字*/
    "26" : dms.TextInText,
    /*摇一摇*/
    "27" : dms.Shake,
    /*颠三倒四*/
    "28" : dms.Disorderly,
    /*假话--刮刮乐*/
    "29" : dms.Clip,
    /*倒计时*/
    "30" : dms.Timer,
    /*密码元素*/
    "31" : dms.Password,
    /*日期倒计时元素*/
    "32" : dms.DateCountdown,
    /*显示组合框*/
    "34" : dms.MultiFrame,
    /*内部浏览器*/
    "35" : dms.InnerBrowse,
    /*打赏*/
    "36" : dms.Reward,
    /*图集*/
    "37" : dms.Photos,
    /*标签*/
    "38" : dms.Label,
    /*SVG*/
    "39" : dms.SVG,
    /*全景图*/
    "40" : dms.PanoramicPhoto,
    /*红包*/
    "41" : dms.RedEnvelopes,
    /*无限回答----等同密码只是可以无限次回答*/
    "42" : dms.InfiniteChallenge,
    /*用于呈现其他家盒子以IFrame格式呈现*/
    "43" : dms.ShowBox,
    /*滚动文字组件--滚动到底部的时候可以切页或者执行别的操作*/
    "44" : dms.ScrollText,
    //AR增强现实
    "45" : dms.AR,
    //VR增强现实
    "46" : dms.VR,
    //SVG形状
    "47" : dms.SVGShape,
     //广告
    "48" : dms.AD

};