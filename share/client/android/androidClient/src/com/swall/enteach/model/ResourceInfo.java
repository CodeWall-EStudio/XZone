package com.swall.enteach.model;

import org.json.JSONObject;

/**
 * Created by pxz on 13-12-22.
 */
public class ResourceInfo {

    public static final int RESOURCE_TYPE_TEXT = 0;
    public static final int RESOURCE_TYPE_IMAGE = 1;
    public static final int RESOURCE_TYPE_VIDEO = 2;
    public static final int RESOURCE_TYPE_AUDIO = 3;

    public String user;     // 创建者
    public String activity; // 所属的活动id
    public int type;        // 见上面 RESOURCE_TYPE_*
    public String content;  // 内容，type为1时为文本，其它为链接
    public String comment;  //应该不需要使用
    public int date;        // 创建时间
    public String resourceId;   // id
    public ResourceInfo(JSONObject object){
        user = JSONUtils.getString(object,"user","");
        activity = JSONUtils.getString(object,"activity","");
        type = JSONUtils.getInt(object,"type",0);
        content = JSONUtils.getString(object,"content","");
        comment = JSONUtils.getString(object,"comment","");
        date = JSONUtils.getInt(object,"date",0);
    }
}
