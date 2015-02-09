package com.swall.enteach.activity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.view.ViewStub;
import android.widget.*;
import com.swall.enteach.R;
import com.swall.enteach.model.JSONUtils;
import com.swall.enteach.model.TRAInfo;
import com.swall.enteach.services.ActionListener;
import com.swall.enteach.services.ServiceManager;
import com.swall.enteach.widget.PullToRefreshListView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-16.
 */
public class AvailableActivitiesActivity extends BaseActivity implements AdapterView.OnItemClickListener, View.OnClickListener {

    private static final String KEY_NAME = "name";
    private static final String KEY_CLASS = "class";
    private static final String KEY_COUNT = "count";
    private static final String KEY_RESOURCES = "resouces";
    private static final String KEY_JOINED = "joined";
    private PullToRefreshListView mPullToRefreshListView;
    private ActivitiesListAdapter mAdapter;



    private ActionListener listListener = new ActionListener(AvailableActivitiesActivity.this) {
        @Override
        public void onReceive(int action, Bundle data) {
            removeLoading();
            if(data == null){
                // TODO 处理不同错误类型给出提示
                Toast.makeText(AvailableActivitiesActivity.this,"获取数据失败",Toast.LENGTH_SHORT).show();
                return;
            }
            String str = data.getString("result");
            try {
                JSONObject object = new JSONObject(str);
                int code = object.getInt("c");
                switch(code){
                    case 0:
                        JSONObject resultObject = JSONUtils.getJSONObject(object,"r",new JSONObject());

                        JSONArray array = JSONUtils.getJSONArray(resultObject,"activities",new JSONArray());
                        mAdapter.setJSONData(array);
                        break;
                    default:
                        break;
                }
            } catch (JSONException e) {
                e.printStackTrace();
                // TODO
                Log.e("SWall",TAG+"listListener",e);
            }
        }
    };
    private ViewStub mLoadingView;
    private Button mBtnRefresh;
    private Bundle mData;
    private ListView mListView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);


        setContentView(R.layout.activity_available_list);
        mPullToRefreshListView = (PullToRefreshListView)findViewById(R.id.availableListView);
        mAdapter = new ActivitiesListAdapter(this);
        mListView = mPullToRefreshListView.getAdapterView();
        mListView.setAdapter(mAdapter);

        mListView.setEmptyView(null);
        mLoadingView = (ViewStub)findViewById(R.id.loading);
        mListView.setOnItemClickListener(this);

        //mAdapter.setJSONData(EXAMPLE);
        mData = new Bundle();
        mData.putString("userName",currentAccount.userName);
        fetchData();
    }

    private void fetchData() {
        mApp.doAction(ServiceManager.Constants.ACTION_GET_AVAILABLE_ACTIVITIES, mData, listListener);
        showLoading();
    }

    private void showLoading() {
        if(mBtnRefresh != null){
            mBtnRefresh.setEnabled(false);
        }
        mListView.setEmptyView(null);
        mLoadingView.setVisibility(View.VISIBLE);
    }
    private void removeLoading(){
        mListView.setEmptyView(findViewById(android.R.id.empty));
        mBtnRefresh = (Button) findViewById(R.id.btnRefresh);
        mBtnRefresh.setEnabled(true);

        mBtnRefresh.setOnClickListener(this);

        mLoadingView.setVisibility(View.GONE);
    }


    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override public void onDestroy(){
        super.onDestroy();
        mApp.removeObserver(listListener);
    }

    @Override
    public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
        TRAInfo info = (TRAInfo)adapterView.getAdapter().getItem(position);
        Intent i = new Intent(this,TRAInfoActivity.class);
        Bundle bundle = new Bundle();
        Log.i("JSON", info.toString());
        bundle.putString("json", info.toString());
        i.putExtras(bundle);
        startActivity(i);
    }


    @Override
    public void onClick(View v) {
        switch(v.getId()){
            case R.id.btnRefresh:
                fetchData();
                break;
        }
    }
}
