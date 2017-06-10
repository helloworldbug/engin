var gulp = require('gulp');
var gutil = require('gulp-util');
//var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var cleanCss = require('gulp-clean-css');
var rename = require('gulp-rename');
//var sh = require('shelljs');
var uglify = require('gulp-uglify');
//var templateCache = require('gulp-angular-templatecache');
var gulpCmd = require("gulp-command")(gulp);
var gulpif = require('gulp-if');
var cfg = require("./prj-package-cfg.js").cfg;
var fs = require("fs");
var each = require("gulp-foreach");
var process = require("process");

var dest_dir = ".";
var obfuscate_tag = true;
var zip_tag = true;
var source_set = null;
/** 统一的命令行处理**/
/**
gulp css/js -s 数据集名 [Options]
Options:
**/
gulp.option(null,"-d, --destdir",'the root dir for output','setDestDir')
	.option(null,'-o, --obfuscate'," obfuscate code or not, default YES",'setObfuscateTag')
	.option(null,'-z, --zip', "zip the code",'setZipTag')
	.option(null,'-s, --sourceset',"the set name of source")
	.task("parameters",function(){
		if(this.flags.destdir != null) dest_dir = this.flags.destdir.trim();
		if(this.flags.sourceset != null) source_set = this.flags.sourceset;
		if(this.flags.obfuscate != null) obfuscate_tag = this.flags.obfuscate == "Y";
		if(this.flags.zip != null) zip_tag = this.flags.zip == "Y";
		console.log("source files set:" + source_set + "\n" + 
					"root of dest:" + dest_dir + "\n" + 
					"dest file path:" +  cfg[source_set].dest_dir + " / " + cfg[source_set].dest_file + "\n" + 
					"zip tag: " + zip_tag + "\n" +
					"obfuscate_tag: " + obfuscate_tag + "\n");
	});
gulp.task("scss",["parameters","_package_scss", "_package_scss2"]);
gulp.task("js",["parameters","_package_js"]);
gulp.task("build",["_package_scss","_package_scss2","_package_js"]);
gulp.task("default",function(){
	console.log(
		"gulp scss/js -s 数据集名 [Options]\n" + 
		"\tOptions:\n" +
		"-d 目标根目录\n" +
		"-o Y|N 是否启动代码混淆\n" +
		"-z Y|N 是否启动代码压缩\n");
	console.log("可用数据集[")
	for(var key in cfg){
		console.log(key + " , ");
	}
	console.log("\t]");
});

/**
 * 生成css
 */
gulp.task("_package_scss",function(done){
	var ss = "main_css";
	if(source_set != null) ss = source_set;
	gulp.src(cfg[ss].files)
	.pipe(sass())
    .pipe(gulpif(zip_tag, cleanCss()))
	.pipe(concat(cfg[ss].dest_file))
	.pipe(gulp.dest(dest_dir + "/" + cfg[ss].dest_dir))
	.on('end',done);
});
/**
 * 生成scss
 */
gulp.task("_package_scss2",function(done){
    var ss = "main_css";
    if(source_set != null) ss = source_set;
    gulp.src(cfg[ss].files)
        .pipe(sass())
        .pipe(gulpif(zip_tag, cleanCss()))
        .pipe(concat(cfg[ss].dest_file))
        .pipe(rename("main.scss"))
        .pipe(gulp.dest(dest_dir + "/" + cfg[ss].dest_dir))
        .on('end',done);
});


var load_js_fun = 'function load_files(files,index){\n\
if(files[index] == null)return;\n\
var fileref=document.createElement("script");\n\
fileref.onload=function(){\n\
	var i = index + 1;\n\
	load_files(files,i);\n\
};\
fileref.setAttribute("type","text/javascript");\n\
fileref.setAttribute("src", files[index]);\n\
document.getElementsByTagName("head")[0].appendChild(fileref);\n\
}';


gulp.task("_package_js",function(done){
	var ss="render_js_timeline";
	if(source_set != null) ss = source_set;
	var cwd_length = process.cwd().length;
	var files = [];
	if(dest_dir.charAt(dest_dir.lenght - 1) != "/" ) dest_dir = dest_dir + "/";
	var d_dirs = dest_dir.split("/");
	var file_acc_prefix = "../";
	for(i = 0 ; i < d_dirs.length; i ++){
		if(d_dirs[i] != "." && d_dirs[i] != ""){
			file_acc_prefix = file_acc_prefix + "../";
		}
	}
	if(ss == null) ss = defaultJsSourceset;
	gulp.src(cfg[ss].files)
	.pipe(each(function(f_stream,file){
		var fn = file.path.slice(cwd_length + 1).replace(/\\/g,"/");
		files.push('"' + file_acc_prefix + fn + '"');
		return f_stream;
	}))
	.pipe(concat(cfg[ss].dest_file))
    .pipe(gulpif(obfuscate_tag,uglify()))
	.pipe(gulp.dest(dest_dir + "/" + cfg[ss].dest_dir))
	.on('end', function(){
		/***生成js的索引文件，方便design阶段直接加载**/
		if(cfg[ss]["act_file_list"] != null){
			var content = '//文件是自动生成，请勿直接编辑\n(function(){var files = [' + files.join(",\n") + '];\n\tload_files(files,0);' + load_js_fun + "})();";
			fs.writeFile(dest_dir+ "/" + cfg[ss].dest_dir + "/" + cfg[ss].act_file_list,content,function(err){if(err) throw err;console.log("js 文件顺序加载文件 " + dest_dir+ "/" + cfg[ss].dest_dir + "/" + cfg[ss]["act_file_list"] + " 生成");});
		}
		if(done != null)done();
	});
});
