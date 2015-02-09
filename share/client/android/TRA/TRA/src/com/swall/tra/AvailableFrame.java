package com.swall.tra;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;
import com.swall.tra.adapter.ActivitiesListAdapter;
import com.swall.tra.model.TRAInfo;
import com.swall.tra.network.ActionListener;
import com.swall.tra.network.ServiceManager;
import com.swall.tra.utils.JSONUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-28.
 */
public class AvailableFrame extends TabFrame implements AdapterView.OnItemClickListener {
    private final static int MSG_REFRESH = 0;
    private Handler mHandler = new Handler(){
        @Override
        public void handleMessage(Message msg) {

            switch(msg.what){
                case MSG_REFRESH:
                    app.doAction(ServiceManager.Constants.ACTION_GET_AVAILABLE_ACTIVITIES, defaultRequestData, listListener);
                    break;
            }
        }
    };
    private int mAutoRetryCount = 0;
    private final int RETRY_MAX = 5;

    @Override
    public View onCreateView(LayoutInflater inflater) {
        mView = inflater.inflate(R.layout.activities_list,null);


        mListView = (ListView)findViewById(R.id.listview);
        mAdapter = new ActivitiesListAdapter(getActivity());
        mListView.setAdapter(mAdapter);
        mListView.setOnItemClickListener(this);

        listListener = new ActionListener(getActivity()) {
            @Override
            public void onReceive(int action, Bundle data) {
                if(data == null){
                    // TODO
                    showEmptyOrShowError();
                    return;
                }
                if(getActivity().isFinishing()){
                    return;
                }
                String str = data.getString("result");
                Log.i("SWall", TAG + " " + str);
                try {
                    JSONObject obj = new JSONObject(str);
                    JSONObject resultObject = JSONUtils.getJSONObject(obj, "r", new JSONObject());

                    JSONArray array = JSONUtils.getJSONArray(resultObject, "activities", new JSONArray());
                    mAdapter.setJSONData(array);
                } catch (JSONException e) {
                    // DO nothing
                    e.printStackTrace();
                    showEmptyOrShowError();
                }

            }
        };
        app.doAction(ServiceManager.Constants.ACTION_GET_AVAILABLE_ACTIVITIES, defaultRequestData, listListener);

        return mView;
    }

    private void showEmptyOrShowError() {
        Activity activity = getActivity();
        if(activity == null || activity.isFinishing()){
            return;
        }
        mAutoRetryCount ++;
        if(RETRY_MAX > mAutoRetryCount){
            Toast.makeText(getActivity(),"暂无数据,5秒后重新刷新...",Toast.LENGTH_SHORT).show();
            mHandler.sendEmptyMessageDelayed(MSG_REFRESH,5000);
        }else{
            //TODO
            Toast.makeText(getActivity(),"无数据，请稍候再打开本程序",Toast.LENGTH_SHORT).show();
            getActivity().finish();
        }
    }


    @Override
    public void onDestroy(){
        super.onDestroy();
        app.removeObserver(listListener);
        mHandler.removeMessages(MSG_REFRESH);
    }

    private ListView mListView;
    private ActivitiesListAdapter mAdapter;
    private ActionListener listListener;



    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
        TRAInfo info = (TRAInfo)adapterView.getAdapter().getItem(position);
        Intent i = new Intent(getActivity(),TRAInfoActivity.class);
        Bundle bundle = new Bundle();
        Log.i("JSON", info.toString());
        bundle.putString("result", info.toString());
        bundle.putBoolean("joinable", true);
        i.putExtras(bundle);
        startActivity(i);
    }
}
