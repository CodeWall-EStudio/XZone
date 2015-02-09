package com.swall.tra.adapter;

import android.content.Context;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;
import com.swall.tra.R;
import com.swall.tra.model.TRAInfo;
import com.swall.tra.utils.JSONUtils;
import com.swall.tra.BaseFragmentActivity;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by pxz on 13-12-24.
 */
public class ActivitiesListAdapter extends BaseAdapter {

    private final WeakReference<BaseFragmentActivity> activityRef;
    private List<TRAInfo> infos;

    public ActivitiesListAdapter(BaseFragmentActivity activity){
        super();
        activityRef = new WeakReference<BaseFragmentActivity>(activity);
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

            convertView = inflater.inflate(R.layout.item_activity,parent,false);
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

        BaseFragmentActivity activity = activityRef.get();
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
        private final TextView longDesc;

        public ViewHolder(View convertView) {
            name = (TextView) convertView.findViewById(R.id.tra_name);
            longDesc = (TextView)convertView.findViewById(R.id.tra_long_desc);
        }
         public void update(TRAInfo info)  {
            name.setText(info.title);
            longDesc.setText(info.getLongDesc());
        }
    }
}
