package com.swall.enteach.model;

/**
 * Created by pxz on 13-12-14.
 */

import android.text.format.Time;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * TRA : Teaching and Researching Activity
 */
public class TRAInfo {
    private String mJsonString;
    private String mResourceDesc; //  xx人参与，10条文字，5张图片，3段视频，4段录音
    public ArrayList<ResourceInfo> resources = new ArrayList<ResourceInfo>();
    public String creator;

    public List<String> invitedUsers = new ArrayList<String>();//可为空
    public boolean isPublic;    // 是否公开课

    public List<String> participators = new ArrayList<String>();     // 参与者
    public boolean activeStatus;    // 是否开放中的活动
    public String title;
    public String desc;
    public long beginDate;
    public long createDate;
    public String teacher;
    public int grade;
    public int _class;
    public String subject;
    public String domain;

    public String id;
    private String mTimeFormatted;
    private boolean mJoined;
/*
{
      "users": {
        "creator": "oscar",
        "invitedUsers": [
          "*"
        ],
        "participators": []
      },
      "resources": [],
      "active": true,
      "info": {
        "title": "三個戴錶重要思想",
        "desc": null,
        "type": 1,
        "date": "2014-05-07T11:02:06.758Z",
        "createDate": "2013-12-19T13:42:15.227Z",
        "teacher": "雷鋒",
        "grade": "3",
        "class": "2",
        "subject": "三個戴錶重要思想",
        "domain": "毛克思理論"
      },
      "_id": "52b2f7b7dcd66b942728d8b4"
    }
 */

    /**
     *
     * @param object
     */

    public TRAInfo(JSONObject object){

        mJoined = false;

        JSONObject userObject = JSONUtils.getJSONObject(object,"user",new JSONObject());

        creator = JSONUtils.getString(userObject,"creator","admin");
        JSONArray participatorArray = JSONUtils.getJSONArray(userObject,"participators",new JSONArray());
        participators = JSONUtils.JSONStringArrayToStringArray(participatorArray);
        JSONArray invitedUserArray = JSONUtils.getJSONArray(userObject,"invitedUsers",new JSONArray());
        invitedUsers = JSONUtils.JSONStringArrayToStringArray(invitedUserArray);

        JSONArray resourceArray = JSONUtils.getJSONArray(object,"resources",new JSONArray());
        for(int i=0;i<resourceArray.length();++i){
            JSONObject resourceObject = JSONUtils.arrayGetJSONObject(resourceArray,i);
            if(resourceObject != null){
                resources.add(new ResourceInfo(resourceObject));
            }
        }

        activeStatus = JSONUtils.getBoolean(object,"active",true);

        JSONObject infoObject = JSONUtils.getJSONObject(object,"info",new JSONObject());

        title = JSONUtils.getString(infoObject,"title","公开课");
        desc = JSONUtils.getString(infoObject,"desc","");
        createDate = JSONUtils.getLong(infoObject, "createDate", 0l);
        beginDate = JSONUtils.getLong(infoObject, "date", (new Time().toMillis(false) / 1000));;
        teacher = JSONUtils.getString(infoObject, "teacher", "待定");
        _class = JSONUtils.getInt(infoObject,"class",1);
        grade = JSONUtils.getInt(infoObject,"grade",1);
        subject = JSONUtils.getString(infoObject,"subject","");
        domain = JSONUtils.getString(infoObject,"domain","");


        id = JSONUtils.getString(object,"_id","");

        mJsonString = object.toString();


        // init time formatted to show
        Time t = new Time();
        t.set(beginDate*1000);
        Time today = new Time();
        today.setToNow();
        long dt = today.toMillis(false)/1000 - beginDate;
        int d = 0;
        if(dt > 2 || dt <-2)d = -100;

        d = (int)dt;
        switch (d){
            case -2:
                mTimeFormatted = t.format("后天 %H:%M");
                break;
            case -1:
                mTimeFormatted = t.format("明天 %H:%M");
                break;
            case 0:
                mTimeFormatted = t.format("今天 %H:%M");
                break;
            case 1:
                mTimeFormatted = t.format("昨天 %H:%M");
                break;
            case 2:
                mTimeFormatted = t.format("前天 %H:%M");
                break;
            default:
                mTimeFormatted = t.format("%Y年%m月%d日 %H:%M");
                break;

        }


        // init resrouce desc
        mResourceDesc=participators.size()+"人参与 ";
        mResourceDesc += caculateResourceDesc(resources);

    }

    private static String caculateResourceDesc(ArrayList<ResourceInfo> resources) {
        int texts=0;
        int images = 0;
        int videos = 0;
        int audios = 0;
        for(ResourceInfo info:resources){
            switch (info.type){
                case ResourceInfo.RESOURCE_TYPE_AUDIO:
                    audios++;
                    break;
                case ResourceInfo.RESOURCE_TYPE_TEXT:
                    texts ++;
                    break;
                case ResourceInfo.RESOURCE_TYPE_IMAGE:
                    images++;
                    break;
                case ResourceInfo.RESOURCE_TYPE_VIDEO:
                    videos++;
                    break;
                default:
                    // TODO report unknow type
                    break;
            }
        }
        StringBuilder builder = new StringBuilder(8);

        if(texts != 0){
            builder.append(texts);
            builder.append("条文字 ");
        }
        if(images!= 0){
            builder.append(images);
            builder.append("张图片 ");
        }
        if(videos != 0){
            builder.append(videos);
            builder.append("段视频 ");
        }
        if(audios != 0){
            builder.append(audios);
            builder.append("段视频 ");
        }
        return builder.toString();

    }

    @Override
    public String toString(){
        return mJsonString;
    }

    public String getResourceDesc(){// xx人参与，10条文字，5张图片，3段视频，4段录音
        return mResourceDesc;
    }

    public String getTimeFormated() {
        return mTimeFormatted;
    }

    public void setJoined(boolean joined) {
        this.mJoined = joined;
    }

    public boolean ismJoined(){
        return mJoined;
    }
}
