// 文件名称: mesns_api.js 
// 创 建 人: nyh 
// 创建日期: 2015/06/05
// 版本号：V1.8
// 描    述: ME社交接口 

var sns_data = {};
sns_data.data_site = 0;//来源：0-ME App; 1-PC端;2-微信

/*********************************************** 获取当前登录对象  *****************************************************/
/** 
   返回当前登录用户对象,特别要注意接口在 外部使用浏览不需要账户系统的时候不能调用这个方法，需要更加用户id字符串去反查
**/
sns_data.getCurrentUser = function () {
    var currentUser = fmacloud.User.current();
    if (currentUser) {
        return currentUser;
    } else {
        return null;
    }
};

/*********************************************** 站内信系统消息 ********************************************************/

/** 消息中心interface ：获取未读消息总数
    msg_id
 **/
sns_data.getCountUnreadMsg = function (cb_ok, cb_err) {
    var currentLUser = this.getCurrentUser();
    if (!currentLUser) return;

    var strCQL = " select count(*) from me_message where msg_recid='" + currentLUser.id + "' "
              + "  and msg_status=0  or objectId in  ( select objectId from me_message where msg_recid='0' "
              + "  and msg_textid_str not in ( select msg_textid_str  from me_message where msg_recid='" + currentLUser.id + "' ))";

    fmacloud.Query.doCloudQuery(strCQL, {
        success: cb_ok,//获取方式obj.count
        error: cb_err
    });
};

/** 消息中心interface ：获取站内信列表
    msg_id
**/
sns_data.getSysMessageByUserid = function (options, cb_ok, cb_err) {
    var currentLUser = this.getCurrentUser();
    var pageSize = options.pageSize,
        pageNumber = options.pageNumber,
        isdesc = options.isdesc,
        orderby = options.orderby;

    if (!currentLUser) return;
    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }
    var strCQL = " select include msg_sendid,include msg_textid,* from me_message where msg_recid='" + currentLUser.id + "' "
              + " and msg_type=0 and msg_status!=2  or objectId in  ( select objectId from me_message where msg_recid='0' "
              + " and msg_status!=2 and msg_textid_str not in ( select msg_textid_str  from me_message where msg_recid='" + currentLUser.id + "' ))";
    //排序
    if (isdesc) {
        strCQL += " order by " + orderby + " desc ";
    } else {
        strCQL += " order by " + orderby + " asc ";
    }
    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    fmacloud.Query.doCloudQuery(strCQL, {
        success: cb_ok,//获取方式obj.count
        error: cb_err
    });
};

/** 消息中心interface ：获取站内信列表 和关注消息
    msg_id
**/
sns_data.getSysFollowMsgByUid = function (options, cb_ok, cb_err) {
    var currentLUser = this.getCurrentUser();
    var pageSize = options.pageSize,
        pageNumber = options.pageNumber,
        isdesc = options.isdesc,
        orderby = options.orderby,
        msg_type = options.msg_type;

    if (!currentLUser) return;
    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }
    var strCQL = " select include msg_sendid,include msg_textid,* from me_message where msg_recid='" + currentLUser.id + "' "
              + " and  msg_type in (" + msg_type + ") and msg_status!=2  or objectId in  ( select objectId from me_message where msg_recid='0' "
              + " and msg_status!=2 and msg_textid_str not in ( select msg_textid_str  from me_message where msg_recid='" + currentLUser.id + "' ))";
    //排序
    if (isdesc) {
        strCQL += " order by " + orderby + " desc ";
    } else {
        strCQL += " order by " + orderby + " asc ";
    }
    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    fmacloud.Query.doCloudQuery(strCQL, {
        success: cb_ok,//获取方式obj.count
        error: cb_err
    });
};

/** 消息中心interface ：根据消息类型获取数据列表
  msg_type-消息类型
**/
sns_data.getMessageByMsgType = function (options, cb_ok, cb_err) {
    var currentLUser = this.getCurrentUser();
    var msg_type = options.msg_type,
        pageSize = options.pageSize || 0,
        pageNumber = options.pageNumber || 10,
        isdesc = options.isdesc,
        orderby = options.orderby || "createdAt";

    if (!msg_type || !currentLUser) return;
    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }

    var strCQL = " select include msg_sendid,include msg_textid,* from me_message where msg_status!=2 and msg_recid='" + currentLUser.id + "' and msg_type=" + parseInt(msg_type);

    //排序
    if (isdesc) {
        strCQL += " order by " + orderby + " desc ";
    } else {
        strCQL += " order by " + orderby + " asc ";
    }
    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    AV.Query.doCloudQuery(strCQL, {
        success: cb_ok,
        error: cb_err
    });
};

/** 消息中心interface ：根据消息类型（数组）获取数据列表
  msg_type-消息类型 数组
**/
sns_data.getMessageByMsgTypeArr = function (options, cb_ok, cb_err) {
    var currentLUser = this.getCurrentUser();
    var msg_type = options.msg_type,
        pageSize = options.pageSize || 0,
        pageNumber = options.pageNumber || 10,
        isdesc = options.isdesc,
        orderby = options.orderby || "createdAt";

    if (!msg_type || !currentLUser) return;
    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }
    //if(msg_type.length>0){
    //    for (var i = 0; i < msg_type.length; i++) {

    //    }
    //}

    var strCQL = " select include msg_sendid,include msg_textid,* from me_message where msg_status!=2 and msg_recid='" + currentLUser.id + "' and msg_type in (" + msg_type + ")";

    //排序
    if (isdesc) {
        strCQL += " order by " + orderby + " desc ";
    } else {
        strCQL += " order by " + orderby + " asc ";
    }
    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    AV.Query.doCloudQuery(strCQL, {
        success: cb_ok,
        error: cb_err
    });
};

/** 消息中心interface ：查看站内信消息，根据站内信消息id 将此添加到当前用户下的message表里并且设置为已读状态
    msg_obj-所查看的当前msg对象
    当前登录用户id
**/
sns_data.viewSysMsg = function (msg_obj, cb_ok, cb_err) {
    if (!msg_obj || !this.getCurrentUser()) return;

    var currentLUser = this.getCurrentUser();
    var ME_Message = fmacloud.Object.extend("me_message");
    var messageobj = new ME_Message();
    messageobj.set("msg_sendid", msg_obj.get("msg_sendid"));
    if (currentLUser) {
        messageobj.set("msg_recid", currentLUser.id);
    }
    messageobj.set("msg_textid", msg_obj.get("msg_textid"));
    messageobj.set("msg_textid_str", msg_obj.get("msg_textid_str"));
    messageobj.set("msg_type", 0);//站内信系统消息
    messageobj.set("msg_status", 1);//站内信系统消息
    messageobj.set("msg_obj", msg_obj.get("msg_obj"));
    messageobj.save(null, {
        success: cb_ok,
        error: cb_err
    });
};

/** 消息中心interface ：app 应用内部 评论，点赞，私信，关注等点击事件操作： 1.发送推送消息（1.5.3版本不做），2.添加一条数据到me_messagetext消息文本,3.添加me_message消息
   msg_recid-消息接受方
   msg_type-消息类型
   msg_obj-消息对象（作品，页，效果图对象）
   mt_content-消息内容json格式
**/
sns_data.msgAdd = function (options, cb_ok, cb_err) {
    var currentLUser = this.getCurrentUser();
    var msg_recid = options.msg_recid,
        msg_type = options.msg_type,
        msg_obj = options.msg_obj,
        mt_content = options.mt_content;

    if (!currentLUser || !msg_recid) return;

    var Messagetext = fmacloud.Object.extend("me_messagetext");
    var msgtext = new Messagetext();
    msgtext.set("mt_content", mt_content);
    msgtext.save(null, {
        success: function (tobj) {
            //添加me_message表数据
            var ME_Message = fmacloud.Object.extend("me_message");
            var messageobj = new ME_Message();
            messageobj.set("msg_sendid", currentLUser);
            messageobj.set("msg_recid", msg_recid);
            messageobj.set("msg_textid", tobj);
            messageobj.set("msg_textid_str", tobj.id);
            messageobj.set("msg_type", msg_type);
            messageobj.set("msg_obj", msg_obj);
            messageobj.set("msg_status", 0);
            messageobj.save(null, {
                success: cb_ok,
                error: cb_err
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
};

/** 消息中心interface ：查看赞，评论，关注，私信消息后修改消息为已读状态 
    msg_obj消息对象
**/
sns_data.msgStatusChange = function (msg_obj, cb_ok, cb_err) {
    if (!msg_obj) return;

    msg_obj.set("msg_status", 1);
    msg_obj.save(null, {
        success: cb_ok,
        error: cb_err
    });
};

/** 消息中心interface ：消息删除
    msg_obj-消息对象
    msg_type-消息类型，如果是系统消息则不对其删除，而是修改状态为3-删除
    删除包括2个操作me_message和me_messagetext 
**/
sns_data.msgDelete = function (msg_obj, msg_type, cb_ok, cb_err) {
    if (!msg_obj) return;

    if (msg_type == 0 && msg_obj.get("msg_status") == 0) {//1.当消息msg_recid='0'进行删除，需要对其先保存到该用户 msg_recid一条系统消息并且设置状态msg_status为 2 删除状态
        if (msg_obj.get("msg_recid") == "0") {
            var new_msgobj = msg_obj.clone();
            if (this.getCurrentUser()) {
                new_msgobj.set("msg_recid", this.getCurrentUser().id);//设置接收用户id
            }
            new_msgobj.set("msg_status", 2);//设置为删除状态
            new_msgobj.save(null, {
                success: cb_ok,
                error: cb_err
            });
        } else {
            msg_obj.set("msg_status", 2);
            msg_obj.save(null, {
                success: cb_ok,
                error: cb_err
            });
        }
    } else if (msg_obj.get("msg_status") == 1) {
        msg_obj.set("msg_status", 2);
        msg_obj.save(null, {
            success: cb_ok,
            error: cb_err
        });
    } else {
        var msgtext_obj = msg_obj.get("msg_textid");
        if (msgtext_obj) {
            msgtext_obj.destroy({
                success: function (text_obj) {
                    msg_obj.destroy({
                        success: cb_ok,
                        error: cb_err
                    });
                },
                error: function (myObject, error) {
                    console.log(error.message);
                }
            });
        }
    }
};

/** new 消息中心interface ：消息删除
    msg_obj-消息对象
    删除包括2个操作me_message和me_messagetext 
**/
sns_data.msgDeleteAll = function (msg_obj, cb_ok, cb_err) {
    if (!msg_obj) return;

    var delmsg = function () {
        var msgtext_obj = msg_obj.get("msg_textid");
        if (msgtext_obj) {
            msgtext_obj.destroy({
                success: function (text_obj) {
                    msg_obj.destroy({
                        success: cb_ok,
                        error: cb_err
                    });
                },
                error: cb_err
            });
        }
    }

    if (msg_obj.get("msg_status") == 0) {//1.当消息msg_recid='0'进行删除，需要对其先保存到该用户 msg_recid一条系统消息并且设置状态msg_status为 2 删除状态
        if (msg_obj.get("msg_recid") == "0") {
            var new_msgobj = msg_obj.clone();
            if (this.getCurrentUser()) {
                new_msgobj.set("msg_recid", this.getCurrentUser().id);//设置接收用户id
            }
            new_msgobj.set("msg_status", 2);//设置为删除状态
            new_msgobj.save(null, {
                success: cb_ok,
                error: cb_err
            });
        } else {
            delmsg();
        }
    } else {
        delmsg();
    }

};

/** 消息中心interface ：根据消息类型（数组）获取未读消息数据列表，并把未读消息状态改为已读
  msg_type-消息类型 数组
**/
sns_data.changeMsgStatus = function (options, cb_ok, cb_err) {
    var currentLUser = this.getCurrentUser();
    var msg_type = options.msg_type;

    if (!msg_type || !currentLUser) {
        cb_err("参数错误!消息类型不能为空");
        return;
    }
    var pageSize = 0;
    var pageNumber = 1000;
    var strCQL = " select include msg_sendid,include msg_textid,* from me_message where msg_status=0 and msg_recid='" + currentLUser.id + "' and msg_type in (" + msg_type + ")";

    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }
    var totalcount = 0;
    var needlooptimes = 0;
    var msglist = [];
    var loopinfo = function (needlooptimes) {
        if (needlooptimes < totalcount || needlooptimes == 0) {
            pageSize = needlooptimes;
            var skip = 0;
            var limit = pageNumber;
            //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
            if (pageSize != 0) {
                skip = pageSize * pageNumber;
            }

            var sql = strCQL + " limit " + skip + "," + limit + " ";
            AV.Query.doCloudQuery(sql, {
                success: function (obj) {
                    if (obj) {
                        totalcount = Math.ceil(obj.count / 1000) > 0 ? Math.ceil(obj.count / 1000) : 0;
                        for (var i = 0; i < obj.results.length; i++) {
                            msglist.push(obj.results[i]);
                        }
                        needlooptimes++;
                        loopinfo(needlooptimes);
                    }
                }, error: function (error) {
                    response.Error(error.message);
                }
            });
        } else {
            //循环修改所有的数据设置为已读
            if (msglist.length > 0) {
                var currentIndex = 0;
                var loopmsgs = function (index) {
                    if (index < msglist.length) {
                        if (msglist[index].get("msg_recid") == "0") {
                            var ME_Message = fmacloud.Object.extend("me_message");
                            var messageobj = new ME_Message();
                            messageobj.set("msg_sendid", msglist[index].get("msg_sendid"));
                            if (currentLUser) {
                                messageobj.set("msg_recid", currentLUser.id);
                            }
                            messageobj.set("msg_textid", msglist[index].get("msg_textid"));
                            messageobj.set("msg_textid_str", msglist[index].get("msg_textid_str"));
                            messageobj.set("msg_type", 0);//站内信系统消息
                            messageobj.set("msg_status", 1);//站内信系统消息
                            messageobj.set("msg_obj", msglist[index].get("msg_obj"));
                            messageobj.save(null, {
                                success: function (obj) {
                                    currentIndex++;
                                    loopmsgs(currentIndex);
                                },
                                error: cb_err
                            });
                        } else {
                            msglist[index].set("msg_status", 1);
                            msglist[index].save(null, {
                                success: function (obj) {
                                    currentIndex++;
                                    loopmsgs(currentIndex);
                                },
                                error: cb_err
                            });
                        }
                    } else {
                        cb_ok("修改成功!");
                    }
                }
                loopmsgs(0);
            }
        }
    }
    loopinfo(0);
};

/** 消息中心interface ：通过消息参数获取未读消息总数
    msg_type:{"issys":[0,4],"like_comment":[1,2],"isChat":[0]}
 **/
sns_data.getMsgCountByTypeArr = function (options, cb_ok, cb_err) {
    var currentUser = this.getCurrentUser();
    if (!currentUser) {
        cb_err("用户未登录!");
        return;
    }
    var callbackJson = {};
    var currentLoop = 0;
    var strCQL = "";
    var arrName = [];
    var arrVal = [];
    var num = 0;
    for (var pram in options) {
        arrName[num] = pram;
        arrVal[num] = options[pram];
        num++;
    }
    var loopmsg = function (index) {
        if (index < arrName.length) {
            var msg_type = arrVal[index];
            var pram = arrName[index];
            if (pram == "issys") {
                strCQL = " select count(*) from me_message where msg_recid='" + currentUser.id + "' and  msg_type in (" + msg_type + ") "
                             + "  and msg_status=0  or objectId in  ( select objectId from me_message where msg_recid='0' "
                             + "  and msg_textid_str not in ( select msg_textid_str  from me_message where msg_recid='" + currentUser.id + "' ))";
            } else if (pram == "isChat") {
                strCQL = " select count(*) from _Conversation where   c_type=0 and  c_mstatus=0 and c='" + currentUser.id + "' and m_readStatus=0  ";
                strCQL += " or objectId in ( select objectId from _Conversation  where   c_type=0 and  c_gstatus=0 and m in ('" + currentUser.id + "') and c!='" + currentUser.id + "' and c_readStatus=0 ) ";
            }
            else {
                strCQL = " select count(*) from me_message where msg_recid='" + currentUser.id + "' and  msg_type in (" + msg_type + ") and msg_status=0 ";
            }
            fmacloud.Query.doCloudQuery(strCQL, {
                success: function (obj) {
                    callbackJson[arrName[index]] = obj.count;
                    currentLoop++;
                    loopmsg(currentLoop);
                },
                error: cb_err
            });
        } else {
            cb_ok(callbackJson);
        }
    }
    loopmsg(0);
};


/** 消息中心interface ：单聊，修改聊天最后一条消息，和2个聊天对象的消息已读未读状态
  cid,_Conversation对象
  last_context,最后一条消息内容
**/
sns_data.updateConvLastmsgAndStatus = function (options, cb_ok, cb_err) {
    var _self=this;
    var cid = options.cid || "",
        last_context = options.last_context || "";
    if (cid.length == 0) {
        cb_err("参数错误会话id为空!");
        return;
    }
    var query = new fmacloud.Query("_Conversation");
    query.equalTo("objectId", cid);
    query.first({
        success: function (chatObj) {
            if (chatObj) {
                chatObj.set("last_context", last_context);
                //根据当前用户id和_Conversation表的 
                if (_self.getCurrentUser()) {
                    if (_self.getCurrentUser().id == chatObj.get("c")) {
                        chatObj.set("m_readStatus", 1);
                        chatObj.set("c_readStatus", 0);
                    } else {
                        chatObj.set("m_readStatus", 0);
                        chatObj.set("c_readStatus", 1);
                    }
                }
                chatObj.save(null, {
                    success: cb_ok,
                    error: cb_err
                });
            } else {
                cb_err("没有需要修改的对象!");
            }
        },
        error: cb_err
    });
};

/***************************************************** 单聊，即时通信  ***************************************************/

/** 单聊，根据好友id和当前用户id查询私聊会话数据,只有一条数据
    friends_uid,用户id
**/
sns_data.getSingleConversation = function (friends_uid, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("未登录用户!")
        return;
    }
    var UserArray = [friends_uid, this.getCurrentUser().id]
    var query = new fmacloud.Query("_Conversation");
    query.containsAll("m", UserArray);
    query.equalTo("c_type", 0);// c_type,0.单聊,1.多聊，2...更多
    query.descending("createdAt");
    query.first({
        success: cb_ok,
        error: cb_err
    });
};

/** 单聊,根据用户id查询该用户聊天数据集 
 c_type,0-单聊，1多聊默认为0
 orderby, 排序字段
 isdesc,是否降序
 pageSize, 页码
 pageNumber, 每页显示条数
**/
sns_data.getConversationListByUid = function (options, cb_ok, cb_err) {
    var currentuser = this.getCurrentUser();
    if (!currentuser) {
        cb_err("");
        return;
    }
    var orderby = options.orderby || "createdAt",
        isdesc = options.isdesc,
        c_type = options.c_type || 0,//默认为0
        pageSize = options.pageSize || 0,
        pageNumber = options.pageNumber || 6;

    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }
    var strCQL = " select include master_pointer,include guest_pointer ,* from _Conversation where   c_type=" + parseInt(c_type) + " and  c_mstatus=0 and c='" + currentuser.id + "' ";
    strCQL += " or objectId in ( select objectId from _Conversation  where   c_type=" + parseInt(c_type) + " and  c_gstatus=0 and m in ('" + currentuser.id + "')) and c!='" + currentuser.id + "' ";

    //排序
    if (isdesc) {
        strCQL += " order by " + orderby + " desc ";
    } else {
        strCQL += " order by " + orderby + " asc ";
    }
    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    fmacloud.Query.doCloudQuery(strCQL, {
        success: cb_ok,
        error: cb_err
    });
};

/** 单聊，根据_Conversation会话对象，修改_Conversation会话属性值
    conv_obj，聊天会话对象
    deleteStatus_name，删除字段名字:c_gstatus|m_mstatus
    deleteStatus_val,字段值: 0|1
    readStatus_name,字段类型m_readStatus|c_readStatus
    readStatus_val,字段值: 0|1
**/
sns_data.updateConversationObj = function (options, cb_ok, cb_err) {
    var conv_obj = options.conv_obj || null,
        deleteStatus_name = options.deleteStatus_name || "",
        deleteStatus_val = options.deleteStatus_val || 0, 
        readStatus_name = options.readStatus_name || "",
        readStatus_val = options.readStatus_val || 0;

    if (!conv_obj) {
        cb_err("参数错误，会话对象为空!");
        return;
    }
    if (deleteStatus_name) {
        conv_obj.set(deleteStatus_name, parseInt(deleteStatus_val));
    }
    if (readStatus_name) {
        conv_obj.set(readStatus_name, parseInt(readStatus_val));
    }
    conv_obj.save(null, {
        success: cb_ok,
        error: cb_err
    });
};

/**********************************************************  点  赞  ******************************************************/

/** 根据被赞对象id查询赞总数
  like_tplid
**/
sns_data.getSnsLikeCount = function (like_tplid, cb_ok, cb_err) {
    if (!like_tplid) return;
    var query = new fmacloud.Query("me_like");
    query.equalTo("like_tplid", like_tplid);
    query.equalTo("like_state", 0);
    query.count({
        success: cb_ok,
        error: cb_err
    });
};

/** 根据当前用户对象查询当前的用户的所有赞
  like_userid，点赞用户id 
**/
sns_data.getSnsLikeByUid = function (cb_ok, cb_err) {
    var currentLUser = this.getCurrentUser();
    if (!currentLUser) return;

    //查询用户点赞过的所有数据总数，以便进行分页查询，获取所有的点赞数据集。
    var queryCount = new fmacloud.Query("me_like");
    queryCount.equalTo("like_userid", currentLUser.id);
    queryCount.equalTo("like_state", 0);
    queryCount.limit(1000);
    queryCount.find({
        success: cb_ok,
        eeror: cb_err
    });

    //var totalpage = 0;
    //var currentPage = 0;
    //var totalLikeList;
    //var loopobj = function () {
    //    if (currentPage < totalpage) {//2/3
    //        var queryList = new AV.Query("me_like");
    //        queryList.equalTo("like_userid", like_userid);
    //        queryList.skip(currentPage);
    //        queryList.limit(1000);
    //        queryList.find({
    //            success: function (currentList) {
    //                if (currentList) {
    //                    totalLikeList.push(currentList);
    //                    currentPage++;
    //                    loopobj();
    //                }
    //            },
    //            error: cb_err
    //        });
    //    }
    //    else if (currentPage < totalpage - 1) {
    //        cb_ok = function () {
    //            return totalLikeList;
    //        }
    //    }
    // }

    ////查询用户点赞过的所有数据总数，以便进行分页查询，获取所有的点赞数据集。
    //var queryCount = new AV.Query("me_like");
    //queryCount.equalTo("like_userid", like_userid);
    //queryCount.count({
    //    success: function (obj) {
    //        if (obj) {
    //            totalpage = obj.lengh / 1000 < 1 ? 1 : Math.round(obj.lengh / 1000);//获取每页1000条数据，计算共有几页
    //            loopobj(currentPage);
    //        } 
    //    },
    //    error: cb_err
    //}); 


};

/** 根据对象id（对象可以为tplobj,pages,评论等对象）查询出该对象是否被当期用户点过赞
    user_id,用户id
    tpl_id,作品id 
**/
sns_data.getSnsLike = function (user_id, like_tplid, orderby, isdesc, skip, limit, cb_ok, cb_err) {
    var query = new fmacloud.Query("me_like");
    if (user_id) {
        query.equalTo("like_userid", user_id);
    }
    if (like_tplid) {
        query.equalTo("like_tplid", like_tplid);
    }
    query.equalTo("like_state", 0);//状态. 0-已取消赞  1-有效赞
    //翻页
    if (skip >= 0 && limit > 0) {
        query.limit(limit);
        query.skip(skip);
    }
    //排序
    if (orderby.length > 0) {
        if (isdesc) {
            query.descending(orderby);
        } else {
            query.ascending(orderby);
        };
    }
    query.find({
        success: cb_ok,
        error: cb_err
    });
};
/** 根据赞对象id查询出该用户的点过赞的作品
     options，参数数组
     like_type,评论目标类型0-微杂志作品，1-众创页评论，
     like_tplid,评论对象id
     orderby, 排序字段
     isdesc,是否降序
     pageSize, 页码
     pageNumber, 每页显示条数 
**/
sns_data.getLikeListByLikeid = function (options, cb_ok, cb_err) {
    var like_type = options.like_type,
        like_tplid = options.like_tplid,
        orderby = options.orderby || "createdAt",
        pageSize = options.pageSize || 0,
        isdesc = options.isdesc,
        pageNumber = options.pageNumber || 6;

    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }

    if (!like_tplid) {
        cb_err("");
        return;
    }

    var strCQL = " select include like_uid_pointer,* from me_like where  like_state=0 ";

    //if (comment_type.length>0&&comment_id.length>0) {
    if (like_type == 0) {
        strCQL += " and  belong_tpl='" + like_tplid + "' ";
    }
    else if (like_type == 1) {
        strCQL += " and  belong_tplpage='" + like_tplid + "' ";
    }
    else if (like_type == 2) {
        strCQL += " and  belong_comment='" + like_tplid + "' ";
    } else {
        strCQL += " and  like_tplid='" + like_tplid + "' ";
    }
    //排序
    if (isdesc) {
        strCQL += " order by " + orderby + " desc ";
    } else {
        strCQL += " order by " + orderby + " asc ";
    }

    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    fmacloud.Query.doCloudQuery(strCQL, {
        success: cb_ok,
        error: cb_err
    });

};

/** 点赞提交信息
     like_opration, 赞类型 like 点赞，cancerlike 取消赞
     like_type, 0-微杂志作品，1-众创页点赞，2-评论，3-拓展后续添加 
     like_tplid,点赞对象id
     data_site,来自哪个终端 0-ME App; 1-PC端;2-微信
 **/
sns_data.snsSaveLike = function (options, cb_ok, cb_err) {
    var currentuser = this.getCurrentUser();
    var like_opration = options.like_opration,
        like_type = options.like_type,
        like_tplid = options.like_tplid,
        data_site = options.data_site || 0,
        belong_tpl = options.belong_tpl || "",
        belong_tplpage = options.belong_tplpage || "",
        belong_comment = options.belong_comment || "";


    if (!like_tplid || !currentuser) return;

    var user_id = currentuser.id;

    //操作内容：tplobj 赞like_int属性加1
    var save_like = function () {
        var query = new fmacloud.Query("me_like");
        query.equalTo("like_userid", user_id);
        query.equalTo("like_tplid", like_tplid);
        query.first({
            success: function (likeobj) {
                if (likeobj) {//如果已经存在该数据说明为0状态 
                    if (like_opration == "like") {
                        likeobj.set("like_state", 0);
                        likeobj.save(null, {
                            success: cb_ok,
                            error: cb_err
                        });
                    } else if (like_opration == "cancerlike") {
                        likeobj.set("like_state", 1);
                        likeobj.save(null, {
                            success: cb_ok,
                            error: cb_err
                        });
                    }
                } else {//如果不存在新增
                    var likeobj = fmacloud.Object.extend("me_like");
                    var obj = new likeobj();
                    obj.set("like_userid", user_id);
                    obj.set("like_tplid", like_tplid);
                    obj.set("like_type", like_type);
                    obj.set("like_state", 0);
                    obj.set("like_uid_pointer", currentuser);//user_obj 可优化为先判断是否在currentUser里有缓存，没有就查询表数据库
                    obj.set("data_site", data_site);//0为来自ME app端的点赞数据 
                    obj.set("belong_tpl", belong_tpl);
                    obj.set("belong_tplpage", belong_tplpage)
                    obj.set("belong_comment", belong_comment)
                    obj.save(null, {
                        success: cb_ok,
                        error: cb_err
                    });
                }
            },
            error: cb_err
        });
    }

    //tplobj赞总计
    var like_tplobj = function () {
        var query = new fmacloud.Query("tplobj");
        query.descending("cratedAt");
        if (like_type == 0) {
            query.equalTo("tpl_id", like_tplid);
        } else if (belong_tpl.length > 0) {
            query.equalTo("tpl_id", belong_tpl);
        }
        query.first({
            success: function (tpl) {
                if (tpl) {
                    var like_int = tpl.get("like_int") || 0;
                    if (like_opration == "like") {
                        tpl.set("like_int", like_int + 1);
                    } else if (like_opration == "cancerlike") {
                        if (like_int > 0) {
                            tpl.set("like_int", like_int - 1);
                        }
                    }
                    tpl.save(null, {
                        success: function (obj) {
                            if (like_type == 1 || belong_tplpage.length > 0) {
                                like_page();
                            } else {
                                save_like();
                            }
                        },
                        error: cb_err
                    });
                } else {
                    save_like();
                }
            },
            error: cb_err
        });
    }

    //page赞总计
    var like_page = function () {
        var query = new fmacloud.Query("page");
        query.descending("cratedAt");
        if (like_type == 1) {
            query.equalTo("objectId", like_tplid);
        } else if (belong_tplpage.length > 0) {
            query.equalTo("objectId", belong_tplpage);
        }
        query.first({
            success: function (pageobj) {
                if (pageobj) {
                    var page_like_int = pageobj.get("page_like_int") || 0;
                    if (like_opration == "like") {
                        pageobj.set("page_like_int", page_like_int + 1);
                    } else if (like_opration == "cancerlike") {
                        if (page_like_int > 0) {
                            pageobj.set("page_like_int", page_like_int - 1);
                        }
                    }
                    pageobj.save(null, {
                        success: function (obj) {
                            if (like_type == 2 || belong_comment.length > 0) {
                                like_comment();
                            } else {
                                save_like();
                            }
                        },
                        error: cb_err
                    });
                } else {
                    save_like();
                }
            },
            error: cb_err
        });
    }

    //comment赞总计
    var like_comment = function () {
        var query = new fmacloud.Query("me_comment");
        query.descending("cratedAt");
        if (like_type == 2) {
            query.equalTo("objectId", like_tplid);
        } else if (belong_comment.length > 0) {
            query.equalTo("objectId", belong_comment);
        }
        query.first({
            success: function (cobj) {
                if (cobj) {
                    var like_int = cobj.get("like_int") || 0;
                    if (like_opration == "like") {
                        cobj.set("like_int", like_int + 1);
                    } else if (like_opration == "cancerlike") {
                        if (like_int > 0) {
                            cobj.set("like_int", like_int - 1);
                        }
                    }
                    cobj.save(null, {
                        success: function (obj) {
                            save_like();
                        },
                        error: cb_err
                    });
                } else {
                    save_like();
                }
            },
            error: cb_err
        });
    }

    if (like_type == 0 || belong_tpl.length > 0) {// tplobj对象在保存数据的时候是存了 like_int 点赞总数的所以这边需要对其做增减
        like_tplobj();

    } else { // 众创页，和评论点赞表数据未冗余点赞总数字段，是根据编号去赞表反查数据获得的总数
        save_like();
    }
};

/**************************************************    评论  ************************************************************/

/** 根据评论对象id查询评论总数 
 comment_id,评论对象id
**/
sns_data.getSnsCommentCountByCid = function (field_name, comment_id, cb_ok, cb_err) {
    //查询用户评论过的所有数据总数，以便进行分页查询，获取所有的点赞数据集。
    var query = new fmacloud.Query("me_comment");
    query.equalTo(field_name, comment_id);
    query.count({
        success: cb_ok,
        error: cb_err
    });
};

/** 根据评论对象id查询出该用户的点过赞的作品
     options，参数数组
     comment_type,评论目标类型0-微杂志作品，1-众创页评论，
     comment_id,评论对象id
     orderby, 排序字段
     isdesc,是否降序
     pageSize, 页码
     pageNumber, 每页显示条数
     其它参数说明：comment_state 状态. 0-有效评论  1-已删除评论,comment_display 0.显示，1.禁用
**/
sns_data.getSnsComment = function (options, cb_ok, cb_err) {
    var comment_type = options.comment_type,
        comment_id = options.comment_id,
        orderby = options.orderby || "createdAt",
        isdesc = options.isdesc,
        pageSize = options.pageSize || 0,
        pageNumber = options.pageNumber || 6;

    var skip = 0;
    var limit = pageNumber;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageSize != 0) {
        skip = pageSize * pageNumber;
    }

    if (!comment_id) return;

    var strCQL = " select include comment_uid_pointer,* from me_comment where  comment_state=0 and comment_display=0 ";

    //if (comment_type.length>0&&comment_id.length>0) {
    if (comment_type == 0) {
        strCQL += " and  belong_tpl='" + comment_id + "'";
    }
    else if (comment_type == 1) {
        strCQL += " and  belong_tplpage='" + comment_id + "'";
    }
    else if (comment_type == 2) {
        strCQL += " and  belong_comment='" + comment_id + "'";
    } else {
        strCQL += " and  comment_id='" + comment_id + "'";
    }
    //}

    //if (comment_id.length > 0) {  
    //    strCQL+=" or (comment_id in (select comment_id from me_comment where comment_id= '"+comment_id+"' or objectId='"+comment_id+"' ) or objectId =(select objectId from me_comment where  objectId='"+comment_id+"' ))";
    //}

    //排序
    if (isdesc) {
        strCQL += " order by " + orderby + " desc ";
    } else {
        strCQL += " order by " + orderby + " asc ";
    }

    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    // console.log(strCQL);
    fmacloud.Query.doCloudQuery(strCQL, {
        success: cb_ok,
        error: cb_err
    });

};

/** 评论
    comment_id,评论对象id
    comment_type,0-微杂志作品，1-众创页评论，2-评论
    comment_uid,评论该微杂志的用户的uid
    comment_content,评论内容 
    data_site, 来源：0-ME App; 1-PC端;2-微信
    comment_parentid,父评论id（对评论进行评论时,评论信息还存在评论表，当然数据comment_type=2 评论）
**/
sns_data.snsSaveComment = function (options, cb_ok, cb_err) {
    var comment_id = options.comment_id,
        comment_type = options.comment_type,
        comment_uid = options.comment_uid,
        comment_content = options.comment_content,
        data_site = options.data_site || 0,
        belong_comment = options.belong_comment || "",
        belong_tpl = options.belong_tpl || "",
        belong_tplpage = options.belong_tplpage || "";

    if (!comment_uid || !comment_id || !this.getCurrentUser()) return;
    var current_user = this.getCurrentUser();
    if (current_user) {

        var save_commentobj = function () {
            var commentobj = fmacloud.Object.extend("me_comment");
            var obj = new commentobj();
            obj.set("comment_id", comment_id);
            obj.set("comment_type", parseInt(comment_type));
            obj.set("comment_uid", comment_uid);
            obj.set("comment_display", 0);//
            obj.set("comment_content", comment_content);//comment_content为JSON格式数据
            obj.set("data_site", parseInt(data_site));
            obj.set("comment_uid_pointer", current_user);
            if (belong_comment.length != 0) {
                obj.set("belong_comment", belong_comment);
            }
            if (belong_tpl.length != 0) {
                obj.set("belong_tpl", belong_tpl);
            }
            if (belong_tplpage.length != 0) {
                obj.set("belong_tplpage", belong_tplpage);
            }
            obj.save(null, {
                success: cb_ok,//当回调成功后需要给微杂志作者发送推送通知
                error: cb_err
            });
        }

        //保存tplobj评论计总数
        var save_tplobj = function () {
            var query = new fmacloud.Query("tplobj");
            query.equalTo("tpl_id", belong_tpl);
            query.descending("createdAt");
            query.first({
                success: function (tpl) {
                    if (tpl) {
                        var comment_int = tpl.get("comment_int") || 0;
                        tpl.set("comment_int", comment_int + 1);
                        tpl.save(null, {
                            success: function (cbobj) {
                                if (belong_tplpage.length > 0) {//如果是对页进行评论则页评论数加1 
                                    //去保存页对象的评论总数
                                    save_page();
                                } else {
                                    save_commentobj();
                                }
                            }, error: cb_err
                        });
                    } else {
                        save_commentobj();
                    }
                },
                error: cb_err
            });
        }

        //保存页评论计总数
        var save_page = function () {
            var query = new fmacloud.Query("page");
            query.equalTo("objectId", belong_tplpage);
            query.descending("createdAt");
            query.first({
                success: function (pageobj) {
                    var page_comment_int = pageobj.get("page_comment_int") || 0;
                    pageobj.set("page_comment_int", page_comment_int + 1);
                    pageobj.save(null, {
                        success: function (cbobj) {
                            if (belong_comment.length > 0) {//如果是对页进行评论则页评论数加1 
                                //去保存页对象的评论总数
                                save_comment();
                            } else {
                                save_commentobj();
                            }

                        }, error: cb_err
                    });
                }, error: cb_err
            });
        }

        //保存评论计总数
        var save_comment = function () {
            var query = new fmacloud.Query("me_comment");
            query.equalTo("objectId", belong_comment);
            query.descending("createdAt");
            query.first({
                success: function (commentobj) {
                    var comment_int = commentobj.get("comment_int") || 0;
                    commentobj.set("comment_int", comment_int + 1);
                    commentobj.save(null, {
                        success: function (cbobj) {
                            save_commentobj();
                        },
                        error: cb_err
                    });
                }, error: cb_err
            });
        }

        if (belong_tpl.length > 0) {
            save_tplobj();
        } else {
            save_commentobj();
        }
    }
};

/**************************************************  关注  ************************************************************/

/** 关注某个用户
    userid,用户id
**/
sns_data.meFollow = function (userid, cb_ok, cb_err) {
    if (!userid || !this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    fmacloud.User.current().follow(userid).then(
        cb_ok,
        cb_err
        );
};
/** 取消关注某个用户
    userid,用户id
**/
sns_data.meUnfollow = function (userid, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    fmacloud.User.current().unfollow(userid).then(
        cb_ok,
        cb_err
        );
};
/** 查询自己关注的用户列表
    followee,用户对象
**/
sns_data.meFolloweeList = function (options, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var followee = options.followee,
        orderby = options.orderby || "createdAt",
        isdesc = options.isdesc,
        pageSize = options.pageSize || 0,
        pageNumber = options.pageNumber || 6,
        userid = options.userid || "";

    var userCurrent;
    var queryUserObj = function () {
        var skip = 0;
        var limit = pageNumber;
        //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        if (pageSize != 0) {
            skip = pageSize * pageNumber;
        }
        var query = userCurrent.followeeQuery();
        query.include(followee);
        query.skip(skip);
        query.limit(limit);
        //排序
        if (orderby.length > 0) {
            if (isdesc) {
                query.descending(orderby);
            } else {
                query.ascending(orderby);
            };
        }
        query.find({
            success: cb_ok,
            error: cb_err
        });
    }
    var getUserObj = function () {
        var query = new AV.Query("_User");
        query.equalTo("objectId", userid);
        query.first({
            success: function (userobj) {
                if (userobj) {
                    userCurrent = userobj;
                    queryUserObj();
                } else {
                    cb_err();
                }
            },
            error: cb_err
        });
    }

    if (userid.length > 0) {
        getUserObj();
    } else {
        userCurrent = fmacloud.User.current();
        queryUserObj();
    }
};

/** 查询自己的粉丝
    follower,用户对象
  **/
sns_data.meFollowerList = function (options, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var follower = options.follower,
     orderby = options.orderby || "createdAt",
     isdesc = options.isdesc,
     pageSize = options.pageSize || 0,
     pageNumber = options.pageNumber || 6,
     userid = options.userid;

    var userCurrent;
    var queryUserObj = function () {
        var skip = 0;
        var limit = pageNumber;
        //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
        if (pageSize != 0) {
            skip = pageSize * pageNumber;
        }
        var query = userCurrent.followerQuery();
        query.include(follower);
        query.skip(skip);
        query.limit(limit);
        //排序
        if (orderby.length > 0) {
            if (isdesc) {
                query.descending(orderby);
            } else {
                query.ascending(orderby);
            };
        }
        query.find({
            success: cb_ok,
            error: cb_err
        });
    }

    var getUserObj = function () {
        var query = new AV.Query("_User");
        query.equalTo("objectId", userid);
        query.first({
            success: function (userobj) {
                if (userobj) {
                    userCurrent = userobj;
                    queryUserObj();
                } else {
                    cb_err();
                }
            },
            error: cb_err
        });
    }

    if (userid.length > 0) {
        getUserObj();
    } else {
        userCurrent = fmacloud.User.current();
        queryUserObj();
    }
};

/** 查询自己关注用户的总数
    
**/
sns_data.getFolloweeCount = function (userid, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var userCurrent;
    var queryUserCount = function () {
        var query = userCurrent.followeeQuery();
        query.include('followee');
        query.count({
            success: cb_ok,
            error: cb_err
        });
    }
    var getUserObj = function () {
        var query = new AV.Query("_User");
        query.equalTo("objectId", userid);
        query.first({
            success: function (userobj) {
                if (userobj) {
                    userCurrent = userobj;
                    queryUserCount();
                } else {
                    cb_err();
                }
            },
            error: cb_err
        });
    }

    if (userid.length > 0) {
        getUserObj();
    } else {
        userCurrent = fmacloud.User.current();
        queryUserCount();
    }
};
/** 查询用户的粉丝总数
    userid,如果非当前登录用户则
**/
sns_data.getFollowerCount = function (userid, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var userCurrent;
    var queryUserCount = function () {
        var query = userCurrent.followerQuery();
        query.include('follower');
        query.count({
            success: cb_ok,
            error: cb_err
        });
    }

    var getUserObj = function () {
        var query = new AV.Query("_User");
        query.equalTo("objectId", userid);
        query.first({
            success: function (userobj) {
                if (userobj) {
                    userCurrent = userobj;
                    queryUserCount();
                } else {
                    cb_err();
                }
            },
            error: cb_err
        });
    }
    if (userid.length > 0) {
        getUserObj();
    } else {
        userCurrent = fmacloud.User.current();
        queryUserCount();
    }
};

/**************************************************  瀑布流发现页相关  ************************************************************/
/** app 发现页获取推荐作品
    pageNumber,每页显示多少条
    pageSize，从多少条开始
    isdesc，是否降序
    orderby,排序字段
    name,作品名称
**/
sns_data.getRecommendTpl = function (options, cb_ok, cb_err) {
    fmacloud.Cloud.run('getRecommendTpl', { "options": options }, {
        success: cb_ok,
        error: cb_err
    });
};

/** 获取推荐用户
    pageNumber,每页显示多少条
    pageSize，从多少条开始
    user_nick,用户昵称
    isdesc，是否降序
    orderby,排序字段
**/
sns_data.getRecommendUser = function (options, cb_ok, cb_err) {
    fmacloud.Cloud.run('getRecommendUser', { "options": options }, {
        success: cb_ok,
        error: cb_err
    });
};
/**获取app发现页相关数据（tplobj,pages,like）
    orderby,排序字段
    isdesc,是否降序
    pageSize,从多少条开始查
    pageNumber,每次查多少条
    search,查询条件（名字或者作品名字）
    tplLabel,标签 
    userid,用户id
    like_show_num,赞显查询多少条
    page_len,页查询多少条
    isStore,是否查询用户收藏数据
    tpl_privacy,是否只查询公开public true-只查询public，false查询所有的
    isActivity,是否为主题
    isfollowee,是否查询关注
    draftArr,草稿数组tpl_id
**/
sns_data.getDiscoverPage = function (options, cb_ok, cb_err) {
    fmacloud.Cloud.run('getDiscoverPage', { "options": options }, {
        success: cb_ok,
        error: cb_err
    });
};

/** 获取活动主题页统计项总数
    tplLabel,主题标签数组
**/
sns_data.getActivityStatistic = function (tplLabel, cb_ok, cb_err) {
    fmacloud.Cloud.run('getActivityStatistic', { "tplLabel": tplLabel }, {
        success: cb_ok,
        error: cb_err
    });
};

/** 上传用户自定义素材（图片音视频）
    material_src,素材路径
    material_name，素材名称
    material_type，素材类型(1.贴纸，2.边框，3.形状，4.背景，5.图片,10.音乐，11-录音文件)
    material_long，录音时长
    user_id，上传用户的id
**/
sns_data.addAppMaterial = function (options, ck_ok, cb_err) {
    var url = options.material_src || "";
    var materialType = options.material_type || 11;
    var material_long = options.material_long || 0;
    var filename = options.material_name || "";
    var user_id = options.user_id || "";
    if (user_id.length == 0) {
        cb_err("参数错误，没有指定用户id");
        return;
    }
    var Materialobj = fmacloud.Object.extend("pc_material");
    var materialobj = new Materialobj();
    materialobj.set("material_src", url);
    materialobj.set("material_name", filename);
    materialobj.set("material_owner", 1);//0系统，1用户为默认值
    materialobj.set("material_type", parseInt(materialType));
    materialobj.set("material_long", parseInt(material_long));
    materialobj.set("user_id", user_id);
    materialobj.save(null, {
        success: ck_ok,
        error: cb_err
    });
};

/** 获取pc_material素材数据
  material_name,素材名称 模糊查询
  material_type,素材类型,(1.贴纸，2.边框，3.形状，4.背景，5.图片,10.音乐，11-录音文件)
  material_owner,所属 0系统，1用户
  sortfield, 排序字段
  isdesc, 是否降序
  pageNumber, 页码
  pageSize，每页显示条数
**/
sns_data.getAppMaterial = function (options, cb_ok, cb_err) {
    var material_name = options.material_name || "",
        material_type = options.material_type || 11,
        material_owner = options.material_owner || 0,
        sortfield = options.sortfield || "createdAt",
        isdesc = options.isdesc || false,
        pageNumber = options.pageNumber || 0,
        pageSize = options.pageSize || 8,
        user_id = options.user_id || "";
    if (user_id.length == 0) {
        cb_err("参数错误，没有指定用户id");
        return;
    }
    var limit = pageSize;
    var skip = 0;
    //比如要看第 10 页，每页 10 条   就应该是 skip 90 ，limit 10
    if (pageNumber != 0) {
        skip = pageSize * pageNumber - pageSize;
    } else {
        skip = pageNumber;
    }
    var strCQL = " select * from pc_material ";
    if (user_id) {
        strCQL += " where user_id='" + user_id + "' ";
    } else {
        strCQL += " where material_owner=" + material_owner;
    }
    if (material_name.length > 0) {
        strCQL += " and material_name like'" + material_name + "' ";
    }
    if (material_type.length != 0) {
        strCQL += " and material_type=" + parseInt(material_type);
    }
    //翻页
    if (skip >= 0 && limit > 0) {
        strCQL += " limit " + skip + "," + limit;
    }
    if (sortfield.length > 0) {
        if (isdesc) {
            strCQL += " order by " + sortfield + "  desc ";
        } else {
            strCQL += " order by " + sortfield + " asc ";
        };
    }
    fmacloud.Query.doCloudQuery(strCQL, {
        success: cb_ok,
        error: cb_err
    });
};

/** 用户删除自己的资源数据
    mid, 资源id (单个资源删除)
**/
sns_data.delAppMaterialByUid = function (mids, cb_ok, cb_err) {//mid, 资源id
    if (mids.length == 0) {
        cb_err("参数错误，资源id为空");
        return;
    }
    var query = new fmacloud.Query("pc_material");
    query.equalTo("objectId", mids);
    query.first({
        success: function (tpl) {
            if (tpl) {
                tpl.destroy({
                    success: cb_ok,
                    error: cb_err
                });
            } else {
                cb_err("无数据可删除");
            }
        },
        error: cb_err
    });
};

/** 根据页id修改页投票总数
    page_id,页id
**/
sns_data.addPagesVote = function (page_id, cb_ok, cb_err) {
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
};

/** 新增反馈数据
 fb_type,类别：0-反馈信息，其他为举报信息：1-app微杂志，2-众创，3-pc微杂志，4-页举报，5-评论举报
 fb_objid ,举报对象id
 context，反馈或举报内容（意见描述，意见补充等）
 fb_contact，联系方式
 f_username, 用户昵称
 f_software_version,软件版本
 f_model,手机型号
 f_sys_version,系统版本
 f_networks,网络环境
 f_screenshots,截图,多张截图用，隔开
 **/
sns_data.addFeedback = function (options, cb_ok, cb_err) {
    if (!this.getCurrentUser()) {
        cb_err("请先登录!");
        return;
    }
    var fb_type = options.fb_type || 0;
    var fb_objid = options.fb_objid || "";
    var context = options.context || "";
    var fb_contact = options.fb_contact || "";

    var f_username = options.f_username || "";
    var f_software_version = options.f_software_version || "";
    var f_model = options.f_model || "";
    var f_sys_version = options.f_sys_version || "";
    var f_networks = options.f_networks || "";
    var f_screenshots = options.f_screenshots || "";

    var feedbackobj = fmacloud.Object.extend("feedback_obj");
    var feedback = new feedbackobj();
    feedback.set("fb_objid", fb_objid);
    feedback.set("fb_type", parseInt(fb_type));
    feedback.set("fb_fromuser", this.getCurrentUser().id);
    feedback.set("fb_contact", fb_contact);
    feedback.set("context", context);
    feedback.set("fb_user_pointer", this.getCurrentUser());

    feedback.set("f_username", f_username);
    feedback.set("f_software_version", f_software_version);
    feedback.set("f_model", f_model);
    feedback.set("f_sys_version", f_sys_version);
    feedback.set("f_networks", f_networks);
    feedback.set("f_screenshots", f_screenshots);

    feedback.save(null, {
        success: cb_ok,
        error: cb_err
    });
};

//YJ111
/** 阅读计数
 param_type,参数类型,tplobj（tplobj对象），tplid（tplid反查）
 param_val, 对象值
 page_int,页数
 **/
sns_data.setTplPv = function (param_type, param_val, page_int, cb_ok, cb_err) {
    page_int = page_int > 0 ? page_int : 1;

    var setPv = function (tplobj) {
        var total_num = 0;
        //算法 页数*（2~5的随机倍数倍数）
        var arr = [2, 3, 4, 5];
        total_num = arr[Math.floor((Math.random()) * 4)] * page_int;
        if (tplobj.get("read_pv")) {
            if (tplobj.get("read_pv") > 0) {
                tplobj.set("read_pv", tplobj.get("read_pv") + total_num);
            } else {
                var read_int = tplobj.get("read_int") || 0;
                tplobj.set("read_pv", read_int + total_num);
            }
        } else {
            var read_int = tplobj.get("read_int") || 0;
            tplobj.set("read_pv", read_int + total_num);
        }
        tplobj.save(null, {
            success: cb_ok,
            error: cb_err
        });
    }
    if (param_type == "tplobj") {
        //获得老数据read_int
        if (param_val) {
            setPv(param_val);
        } else {
            cb_err("对象为空！");
            return;
        }
    } else if (param_type == "tplid") {
        var queryTpl = new AV.Query("tplobj");
        queryTpl.equalTo("tpl_id", param_val);
        queryTpl.first({
            success: function (obj) {
                if (obj) {
                    setPv(obj);
                } else {
                    cb_err("对象为空！");
                    return;
                }
            },
            error: cb_err
        });
    } else {
        cb_err("参数错误！");
        return;
    }
};

window.sns_data = sns_data;