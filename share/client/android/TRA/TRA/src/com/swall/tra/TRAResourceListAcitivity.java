package com.swall.tra;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.TextView;
import com.swall.tra.adapter.ActivityResourceAdapter;
import com.swall.tra.model.ResourceInfo;
import com.swall.tra.model.TRAInfo;
import com.swall.tra.network.ServiceManager;

/**
 * Created by pxz on 14-1-1.
 */
public class TRAResourceListAcitivity extends BaseFragmentActivity implements AdapterView.OnItemClickListener {
    private ListView mListView;
    private View mBtnQuit;
    private TextView mTitleTips;

    private ActivityResourceAdapter mAdapter = new ActivityResourceAdapter();
    private TRAInfo mInfo;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_resource_list);

        mListView = (ListView)findViewById(R.id.listview);
        mListView.setOnItemClickListener(this);

        mBtnQuit = findViewById(R.id.btnBack);
        mBtnQuit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });

        mTitleTips = (TextView)findViewById(R.id.title_tips);


        String str = getIntent().getStringExtra("result");


        mInfo = mAdapter.setJSONData(str);
        if(mInfo == null){
            finish();
        }else{

            // header view
            View headerView = getLayoutInflater().inflate(R.layout.tra_info_detail,null,false);
            TextView name = (TextView)headerView.findViewById(R.id.tra_name);
            TextView time = (TextView)headerView.findViewById(R.id.tra_time);
            TextView desc = (TextView)headerView.findViewById(R.id.tra_intro);
            name.setText(mInfo.title);
            time.setText(mInfo.getTimeFormated());
            desc.setText(mInfo.getAllDesc());
            mListView.addHeaderView(headerView);

            mTitleTips.setText(mInfo.title);
        }

    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

        ResourceInfo info = (ResourceInfo)parent.getAdapter().getItem(position);
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