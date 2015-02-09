package com.swall.tra;

import android.app.Activity;
import android.app.ListActivity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.ListView;
import com.swall.tra.adapter.ActivityResourceAdapter;
import com.swall.tra.model.ResourceInfo;
import com.swall.tra.model.TRAInfo;
import com.swall.tra.network.ServiceManager;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-25.
 */
public class ResourceListActivity extends ListActivity {
    ActivityResourceAdapter mAdapter = new ActivityResourceAdapter();
    private TRAInfo mInfo;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        String str = getIntent().getStringExtra("result");

        mAdapter.setJSONData(str);
        setListAdapter(mAdapter);
        mAdapter.notifyDataSetChanged();

    }

    @Override
    protected void onListItemClick(ListView l, View v, int position, long id) {
        super.onListItemClick(l, v, position, id);
        ResourceInfo info = (ResourceInfo)getListAdapter().getItem(position);
        if(info.type == ServiceManager.Constants.UPLOAD_TYPE_VIDEO){
            Uri uri = Uri.parse(info.content);
            Intent intent = new Intent(Intent.ACTION_VIEW)
                    .setDataAndType(uri, "video/3gp");
            intent.putExtra(Intent.EXTRA_TITLE, "新媒体教研");
            startActivity(intent);
        }else if(info.type == ServiceManager.Constants.UPLOAD_TYPE_IMAGE){
            String url = info.content;
            if(url.startsWith("http")){
                Intent i = new Intent(this,ImageViewActivity.class);
                i.putExtra("url",url);
                startActivity(i);
            }else{
                // do nothing
            }

        }

    }
}