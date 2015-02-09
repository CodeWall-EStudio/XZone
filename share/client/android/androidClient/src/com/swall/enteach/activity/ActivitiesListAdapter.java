package com.swall.enteach.activity;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;
import com.swall.enteach.R;
import com.swall.enteach.model.JSONUtils;
import com.swall.enteach.model.TRAInfo;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by pxz on 13-12-21.
 */
public
class ActivitiesListAdapter extends BaseAdapter {

    private final WeakReference<BaseActivity> activityRef;
    private List<TRAInfo> infos;

    public ActivitiesListAdapter(BaseActivity activity){
        super();
        activityRef = new WeakReference<BaseActivity>(activity);
        infos = new ArrayList<TRAInfo>(5);
    }
    @Override
    public int getCount() {
        return infos == null?0:infos.size();
    }

    @Override
    public Object getItem(int position) {
        if(infos == null || infos.size() <= position)return null;

        return infos.get(position);
    }

    @Override
    public long getItemId(int position) {
        // TODO id不为long
        //TRAInfo info = (TRAInfo)getItem(position);
        return 0l;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        if(convertView == null){
            LayoutInflater inflater = (LayoutInflater) parent.getContext().getSystemService
                    (Context.LAYOUT_INFLATER_SERVICE);

            convertView = inflater.inflate(R.layout.item,parent,false);
        }

        ViewHolder holder = (ViewHolder)convertView.getTag();
        if(holder == null){
            holder = new ViewHolder(convertView);
            convertView.setTag(holder);
        }
        holder.update((TRAInfo)getItem(position));

        return convertView;
    }

    public void setJSONData(String json) {
        try {
            setJSONData(new JSONArray(json));
        } catch (JSONException e) {
            // do nothing?
            Log.e("JSON", "error", e);
            // TODO report
        }
    }

    public void addTRAInfo(JSONObject object){
        infos.add(new TRAInfo(object));
        notifyDataSetChanged();
    }
    public void setJSONData(JSONArray array) {

        BaseActivity activity = activityRef.get();
        String currentAccountName = activity.getCurrentAcccountName();
        for(int i=0;i<array.length();++i){
            JSONObject object = JSONUtils.arrayGetJSONObject(array, i);
            if(object != null){
                TRAInfo info = new TRAInfo(object);

                if(info.participators.indexOf(currentAccountName) >= 0){
                    // 正参与的
                    info.setJoined(true);
                }else{
                    info.setJoined(false);
                }
                infos.add(info);
            }
        }
        notifyDataSetChanged();
    }


    private class ViewHolder {
        private final TextView name;
        private final TextView time;
        private final TextView resouceCount;
        private final TextView paticipantCount;
        private final View joined;

        public ViewHolder(View convertView) {
            name = (TextView) convertView.findViewById(R.id.tra_name);
            time = (TextView)convertView.findViewById(R.id.tra_time);
            paticipantCount = (TextView)convertView.findViewById(R.id.tra_participant_count);
            resouceCount = (TextView)convertView.findViewById(R.id.tra_resource_count);
            joined = convertView.findViewById(R.id.tra_joined);
        }
/*
{
  "c": 0,
  "r": [
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
  ]
}

*/

        public void update(TRAInfo info)  {
            name.setText(info.title);
            time.setText(info.getTimeFormated());
            resouceCount.setText(info.getResourceDesc());
            if(info.ismJoined()){
                joined.setVisibility(View.VISIBLE);
            }else{
                joined.setVisibility(View.GONE);
            }
        }
    }
}
