package com.swall.enteach.activity;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;
import com.android.volley.toolbox.NetworkImageView;
import com.swall.enteach.R;
import com.swall.enteach.services.MyVolley;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by pxz on 13-12-22.
 */
public class ActivityResourceAdapter extends BaseAdapter{

    private List<ResourceItem> mItems = new ArrayList<ResourceItem>();

    @Override
    public int getCount() {
        return mItems.size();
    }

    @Override
    public Object getItem(int position) {
        return mItems.get(position);
    }

    @Override
    public long getItemId(int position) {
        ResourceItem item = (ResourceItem)getItem(position);
        return item.id;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if(convertView == null){
            LayoutInflater inflater = (LayoutInflater) parent.getContext().getSystemService
                    (Context.LAYOUT_INFLATER_SERVICE);

            convertView = inflater.inflate(R.layout.item_resource,parent,false);
        }

        ViewHolder holder = (ViewHolder)convertView.getTag();
        if(holder == null){
            holder = new ViewHolder(convertView);
            convertView.setTag(holder);
        }

        holder.update((ResourceItem)getItem(position));


        return convertView;
    }

    public void setJSONData(String json) {
        try {
            JSONArray array = new JSONArray(json);
            setJSONData(array);
        } catch (JSONException e) {
            // do nothing?
            Log.e("JSON", "ee", e);
            // TODO report
        }
    }

    public void setJSONData(JSONArray array) {
        mItems.clear();
        for(int i=0;i<array.length();++i){
            try {
                mItems.add(new ResourceItem(array.getJSONObject(i)));
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }
        notifyDataSetChanged();
    }

    private class ResourceItem{
        public int type;
        public String owner;
        public String date;
        public String content;
        public int id;
        public String rid;

        private boolean mIsValid = false;
        public ResourceItem(JSONObject item){
            if(item == null)return;
            if(item.has("user") && item.has("content") && item.has("date") &&
                    item.has("type")){

                try {
                    type = item.getInt("type");
                    owner = item.getString("user");
                    content  = item.getString("content");
                    date = item.getString("date");
                    //id = Integer.valueOf(item.getString("_id"),16);// 后台返回的id似乎太大
                    id = 0;
                    rid = item.getString("_id");
                } catch (JSONException e) {
                    e.printStackTrace();
                    mIsValid = false;
                }
            }else {
                mIsValid = false;
            }
        }
        public boolean isValid(){
            return mIsValid;
        }
    }


    private class ViewHolder {
        private static final int ITEM_TYPE_TEXT = 0;
        private final TextView name;
        private final TextView dateTime;
        private final NetworkImageView imageView;
        private final TextView textView;
        private final View joined;

        public ViewHolder(View convertView) {
            name = (TextView) convertView.findViewById(R.id.item_resource_owner);
            textView = (TextView)convertView.findViewById(R.id.item_resource_text);
            imageView = (NetworkImageView)convertView.findViewById(R.id.item_resource_image);
            dateTime = (TextView)convertView.findViewById(R.id.item_resource_time);
            joined = convertView.findViewById(R.id.tra_joined);
        }
/*
[
      {
        "_id": "52b665e1dcd66b942728d8b7",
        "user": "irjr",
        "activity": "52b2f7b7dcd66b942728d8b4",
        "type": 0,
        "content": "我是一句评论",
        "comment": null,
        "date": "2013-12-22T04:09:05.573Z"
      },
      {
        "_id": "52b665e1dcd66b942728d8b7",
        "user": "irjr",
        "activity": "52b2f7b7dcd66b942728d8b4",
        "type": 1,
        "content": "http://w.qq.com/icon.png",
        "comment": null,
        "date": "2013-12-22T04:09:05.573Z"
      },
      {
        "_id": "52b665e1dcd66b942728d8b7",
        "user": "irjr",
        "activity": "52b2f7b7dcd66b942728d8b4",
        "type": 2,
        "content": "http://www.abc.com/vedio.mp4",
        "comment": null,
        "date": "2013-12-22T04:09:05.573Z"
      },
      {
        "_id": "52b665e1dcd66b942728d8b7",
        "user": "irjr",
        "activity": "52b2f7b7dcd66b942728d8b4",
        "type": 3,
        "content": "http://www.abc.com/audio.mp3",
        "comment": null,
        "date": "2013-12-22T04:09:05.573Z"
      }
    ]
*/

        public void update(ResourceItem item) {

            name.setText(item.owner);
            dateTime.setText(item.date);
            if(item.type  == ITEM_TYPE_TEXT){
                textView.setVisibility(View.VISIBLE);
                imageView.setVisibility(View.GONE);
                textView.setText(item.content);
            }else{
                textView.setVisibility(View.GONE);
                imageView.setVisibility(View.VISIBLE);
                imageView.setImageUrl(item.content, MyVolley.getImageLoader());
            }

        }
    }
}
