// 文件名称: model
//
// 创 建 人: chenshy
// 创建日期: 2015/5/29 9:44
// 描    述: model
dms.model = {
    /**
     * 根据id查询，作品信息
     * @param id    作品ID
     * @param fnOk  成功回调
     * @param fnErr 错误回调
     */
    getTplObjById : function(id,fnOk, fnErr){
        fmacapi.tpl_get_tpl_json(id, function (data) {
            if(data){
                fnOk(data);
            }
        }, function (err) {
            fnErr(null,err);
        }, true);
    },


    /**
     * 根据id查询，作品页数据信息
     * @param id    作品ID
     * @param fnOk  成功回调
     * @param fnErr 错误回调
     */
    getTplPagesById : function(id,fnOk, fnErr){
        fmacapi.tpl_get_data_json(id, function (data) {
            fnOk(data);
        }, function (err) {
            this.cld_get_tpl_data_LocalFun(id ,function(data){
                fnOk(data);
            }, function(err){
                fnErr(null,err);
            });
        });
    },
    /** 根据作品id 查询作品页和元素对象数据,  本地
     tpl_id
     **/
    cld_get_tpl_data_LocalFun : function (tplid, callback_ok, callback_err) {
        var stdout = { "log": "" };
        var cb_err = function (err) {
            callback_err(err.message);
        };
        if (!tplid) {
            cb_err("作品id为空!");
            return;
        }
        try {
            var _execute_array_task = function (objarray, index, cb_task, cb_ok, cb_err) {
                if (objarray) {
                    cb_task(objarray[index],

                        function (obj) {

                            if (index < objarray.length - 1) {

                                _execute_array_task(objarray, index + 1, cb_task, cb_ok, cb_err);

                            }
                            else {

                                cb_ok(objarray);

                            }
                        },

                        cb_err
                    );
                } else {
//                    console.log(tplid + " its pages data is destroyed ");
                    cb_err(tplid + " its pages data is destroyed!");
                    return;
                }
            }
            var _execute_array_task_ignore_error = function (objarray, index, cb_task, cb_ok, cb_err) {
                if (objarray) {
                    cb_task(objarray[index],

                        function (obj) {

                            if (index < objarray.length - 1) {

                                _execute_array_task(objarray, index + 1, cb_task, cb_ok, cb_err);

                            }
                            else {

                                cb_ok(objarray);

                            }
                        },

                        function (err) {

                            cb_err(err);

                            if (index < objarray.length - 1) {

                                _execute_array_task(objarray, index + 1, cb_task, cb_ok, cb_err);

                            }
                        }
                    );
                } else {
//                    console.log(tplid + " its pages data is destroyed ");
                    cb_err(tplid + " its pages data is destroyed!");
                    return;
                }
            }

            ////
            var addlog = function (logstr) {

                stdout.log += (logstr + "\r\n");

            };

            var ConvertTpldata2Json = function (tpldata) {

                var tjobj = tpldata.toJSON();
                var pages = tpldata.get("pages");
                var pagesjson = [];

                for (var i = 0; i < pages.length; i++) {

                    var page = pages[i];
                    var pagejson = page.toJSON();
                    var items = page.get("item_object");
                    var itemsjson = [];

                    for (var j = 0; j < items.length; j++) {

                        var item = items[j];
                        itemsjson[j] = item.toJSON();

                    }

                    pagejson.item_object = itemsjson;

                    pagesjson[i] = pagejson;

                }

                tjobj.pages = pagesjson;

                return tjobj;

            };

            var cb_ok = function (tpl_data) {

                stdout.data = tpl_data;
                callback_ok(ConvertTpldata2Json(tpl_data));

            };

            var _fetch_object = function (objarray, index, cb_ok, cb_err) {

                _execute_array_task(objarray, index,

                    function (obj, cb_task_ok, cb_task_err) {

                        obj.fetch().then(cb_task_ok, cb_task_err);
                    },

                    function (obj) {

                        cb_ok(obj);

                    },

                    cb_err);

            };

            var data_obj = AV.Object.extend("pages_data");
            var query = new AV.Query(data_obj);

            query.equalTo("key_id", tplid);
            query.descending("createdAt");
            query.find().then(function (dobjs) {

                if (dobjs.length > 0) {

                    var dobj = dobjs[0];
                    var pages = dobj.get("pages");

                    //获取每个页对象数据
                    _fetch_object(pages, 0, function (pages) {

                        //addlog("pages:"+ pages[0].toJSON());
                        //获取每个page的item数据(elem元素)

                        _execute_array_task(pages, 0,

                            function (page, cb_ok, cb_err) {

                                var items = page.get("item_object");
                                _fetch_object(items, 0, cb_ok, cb_err);
                            },
                            function (obj) {
                                var page = dobj.get("pages")[0];
                                if (!!page.get("item_object")[0].get("item_id")) {
                                    //addlog("itemid:"+page.get("item_object")[0].get("item_id"));
                                    cb_ok(dobj);
                                } else {
                                    cb_err(new AV.Error(3201, "元素数据可能已受到损坏。"));
                                }
                            },

                            cb_err
                        );

                    }, cb_err);
                } else {
                    cb_err(new AV.Error(3202, "指定ID的数据不存在。"));
                }
            }, function (error) {
                cb_err(error);
            });
        } catch (e) {
            console.log("ME作品数据出错！" + e.message);
            cb_err(tplid + "作品数据出错！" + e.message);
        }
    },
    /**
	 * 查询作品
	 */
    getTplById : function(id,fn){
        var tpl,tplData,isCallback = false;
        fmacapi.tpl_get_tpl_json(id, function (data) {
            tpl = data;
            if(tplData && !isCallback){
                tpl.page_value = tplData;
                isCallback = true;
                fn(tpl);
            }
        }, function (err) {
            if(!isCallback){
                isCallback = true;
                fn(null,err);
            }
        }, true);

        fmacapi.tpl_get_data_json(id, function (data) {
            tplData = data.pages;
            if(tpl && !isCallback){
                tpl.page_value = tplData;
                isCallback = true;
                fn(tpl);
            }
        }, function (err) {
            if(!isCallback){
                isCallback = true;
                fn(null,err);
            }
        })
    },

	/**
	*根据ID查询用户
	*/
	queryUserLevelByUserId : function (userId, cb_ok, cb_err) {
		var query = new fmacloud.Query("_User");
		query.equalTo("objectId", userId); //用户id
		query.first({
			success: cb_ok,
			error: cb_err
		});
	},

		/**
   查询当前用户作品列表用户热门推荐作品集合
   field，   字段名
   fieldval，字段值
   orderby,  排序字段
   isdesc,   是否降序
   user_id,  用户ID
   shownum,  查询多少条数据
 */
	queryUserTplByUserId : function (field, fieldval, orderby, isdesc, user_id, shownum, cb_ok, cb_err) {

		var query = new fmacloud.Query("tplobj");

		query.equalTo("author", user_id); //用户id
		query.equalTo("tpl_privacy","public");
		query.notEqualTo("tpl_state", 1); //状态为1的是未完成的作品
		query.equalTo("tpl_type", 11); //类别为多页作品，微杂志

		if (field.length > 0) {
			query.equalTo(field, fieldval);
		}
		if (orderby.length > 0) {
			if (isdesc) {
				query.descending(orderby);
			} else {
				query.ascending(orderby);
			};
		}
		query.limit(shownum);
		query.find({
			success: cb_ok,
			error: cb_err
		});
	},

	//查询微杂志尾页热门推荐作品
	queryHotTpl : function (cb_ok, cb_err) {
		var query = new fmacloud.Query("appconf");
		query.first({
			success: cb_ok,
			error: cb_err
		});
	},
    /**
     * 根据页ID更新页的投票数
     * @param page_id
     * @param cb_ok
     * @param cb_err
     */
    addPagesVote : function (page_id, cb_ok, cb_err){
        if (!page_id) {
            cb_ok("");
            return
        }
        var query = new fmacloud.Query("page");
        query.equalTo("objectId", page_id);
        query.descending("createdAt");
        query.first({
            success: function (pageobj) {
                var page_vote = pageobj.get("page_vote") || 0;
                pageobj.set("page_vote", page_vote + 1);
                pageobj.save(null, {
                    success: cb_ok,
                    error: cb_err
                });
            }, error: cb_err
        });
    },
    /**
     *  添加用户反馈信息，包括输入框、单选、多选
     * @param tplData           作品数据信息
     * @param wrapper           容器对象
     * @param feedbackData      反馈信息对象 feedbackData
     * @param call_ok           保存成功的反馈 call_ok
     */
    addFeedbackInfor : function(tplData, wrapper, container){
        var hasContent = false;
        //找出所有input
        var data = {};
        //拼接输入框的值
        var inputContent = {};
        var inputContentArr = [];
        //输入框
        var inputArr = wrapper.find("input[data-input='user-input']");
        inputArr.each(function () {
            var fb_field = $(this).attr('data-fb-field');
            var objectId = $(this).attr('data-objectId');
            var fb_val = $(this).val();
//            if (fb_field && fb_val) {
//                data[fb_field] = fb_val;
//            }
            if(fb_val&&objectId){
                var tempObj = {};
                tempObj[objectId] = fb_val;
                inputContentArr.push(tempObj);
            }
            if (fb_val) {
                hasContent = true;
            }
        });
        //赋值  如{ "input_content":[{objcetId:"张三"}，{objectId:"41191379@qq.com"} ] }
        if(inputContentArr.length > 0){
            inputContent["input_content"] = inputContentArr;
            data["cd_input"] = JSON.stringify(inputContent);
        }
        //单选框
        var radioArr = wrapper.find("input[data-radio='user-radio']");
        radioArr.each(function () {
            var fb_field = $(this).attr('data-fb-field');
            var objectId = $(this).attr('data-objectId');
            if($(this).prop("checked")){
                hasContent = true;
                var fb_val = $(this).val();
//                if (fb_field && fb_val) {
//                    data[fb_field] = fb_val;
//                }
                if(objectId && fb_val){
                    data["cd_radio"] = objectId;
                    data["cd_radio_val"] = fb_val;
                }
            }
        });
        //多选框
        var checkboxArr = wrapper.find("input[data-checkbox='user-checkbox']");
        var checkboxContent = "";
        var checkObjectId = "";
        checkboxArr.each(function () {
            var fb_field = $(this).attr('data-fb-field');
            checkObjectId = $(this).attr('data-objectId');
            if($(this).prop("checked")){
                hasContent = true;
                checkboxContent += $(this).val() +"|";
//                if (fb_field && checkboxContent) {
//                    data[fb_field] = checkboxContent;
//                }
            }
        });
        if(checkObjectId && checkboxContent){
            data["cd_checkbox"] = checkObjectId;
            data["cd_checkbox_val"] = checkboxContent;
        }

        //表单至少有一项有值,并且至少有一个输入框
        if(!hasContent){
            new dms.MsgBox(container[0], "请填写表单");
            return;
        }
        var customerData = null;
        //2016-1-6 create BY fishYu 修改每次插入都是新的数据
        customerData = new CustomerData();
//        if(!feedbackData){
//            customerData = new CustomerData();
//        }else{
//            customerData = feedbackData;
//        }

        //作品ID
        if(tplData.tpl_id){
            customerData.set("cd_tplid", tplData.tpl_id);
        }
        //用户ID
        if(tplData.author){
            customerData.set("cd_userid", tplData.author);
        }
        //暂时不需要考虑头像,只是设置一个默认头像
        customerData.set("cd_userhead", "http://ac-hf3jpeco.clouddn.com/1180e61bd594192f1707.jpg");//http://ac-hf3jpeco.clouddn.com/XqjQmhDhDLz4rQzeKaQVyVW7OKqPU4CvQ7QKJlPm.jpg");
        for(var key in data){
            customerData.set(key, data[key]);
        }
        //在微信里面打开的情况
//		if (this.userAgent.indexOf("micromessenger") > -1){
//			//设置用户头像
//		}
        customerData.save(null, {
            success: function(obj) {
                //保存成功清空数据
                inputArr.each(function(){
                    $(this).val("");
                });
                //还原单选框默认状态
                radioArr.each(function(){
                    $(this).prop("checked", false);
                });
                //还原复选框默认状态
                checkboxArr.each(function(){
                    $(this).prop("checked", false);
                });
                //消息提示框
                new dms.MsgBox(container[0], "感谢您的参与");
//                console.log(obj);
//                if(call_ok){
//                    call_ok(obj);
//                }
            },
            error: function(obj, error) {
                console.log('Failed to create new object, with error code: ' + error.message);
            }
        });
    },

    /**修改作品信息
     tpl_id,作品id
     options,{"author_recno":5,"recommend_status":2} 注意字段类型
     **/
    updateTpl: function (tpl_id, options, cb_ok, cb_err) {
        if (!tpl_id) {
            cb_err("作品id为空!");
            return;
        }
        var query = new AV.Query("tplobj");
        query.equalTo("tpl_id", tpl_id);
        query.first({
            success: function (results) {
                for (var c in options) {
                    results.set(c, options[c]);
                }
                results.save(null, {
                    success: function (msg) {
                        cb_ok(msg);
                    }
                });
            },
            error: function (error) {
                cb_err(err.message);
            }
        })
    },
    /**
     * 根据页ID获取页的投票数
     * @param page_id
     * @param cb_ok
     * @param cb_err
     */
    queryPageVoteNumber : function (page_id, cb_ok, cb_err){
        if (!page_id) {
            cb_ok("");
            return
        }
        var query = new fmacloud.Query("page");
        query.equalTo("objectId", page_id);
        query.first({
            success: cb_ok, error: cb_err
        });
    }

};