var main_css_files = ['./scss/main.scss'];

var js_files = [
    './lib/timeline/test/lib/timeline.js',
    './vendor/fontfaceonload.js',
	'./vendor/jquery.tap.js',
    './vendor/hammer.min.js',
    './lib/pageSwitch.js',
    './vendor/swipe.js',
    './lib/comment.min.js',
    './vendor/buzz.js',
    './lib/lrc.js',
    './vendor/event/*.js',
    './src/dms.js',
    './src/display/core/dms.DisplayObject.js',
    './src/display/core/dms.RenderObject.js',
    './src/display/core/dms.BaseText.js',
    './src/display/core/dms.Image.js',
    './src/display/render_object/dms.Text.js',
	'./src/display/render_object/dms.ImageSprite.js',
    './src/display/render_object/*.js',
    './src/display/core/*.js',
    './src/display/*.js',
    './src/**/*.js'
];


var timeline_js_files = [
        "./branches/timeline/new/Cyan.js",
        "./branches/timeline/new/common.js",
        "./branches/timeline/new/Composition.js",
];


/**
	数据集定义
	
**/

exports.cfg = {
	"main_css":{
		"files":['./scss/main.scss'],
		"dest_dir":"dist/css",
		"dest_file":"main.css"
	},
	"render_js":{
		"files":js_files,
		"dest_dir":"dist/js",
		"dest_file":"render.js",
		"act_file_list":"../../test/render_files.js"
	},
	"base_css":{
		"files":["./scss/base.scss"],
		"dest_dir":"assets/www/css",
		"dest_file":"base.min.css"
	},
	"timeline_js":{
		"files":timeline_js_files,
		"dest_dir":"timeline/test/lib",
		"dest_file":"timeline.js"
	},
	"render_js_timeline":{
		"files":["./timeline/test/lib/timeline.js"].concat(js_files),
		"dest_dir":"dist/js",
		"dest_file":"render.js",
		"act_file_list":"../../test/render_files.js"
	}
};