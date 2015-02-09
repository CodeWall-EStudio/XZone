package com.swall.enteach.activity;

import android.os.Bundle;
import android.util.Log;
import android.widget.ListView;
import com.swall.enteach.R;
import com.swall.enteach.model.JSONUtils;
import com.swall.enteach.services.ActionListener;
import com.swall.enteach.services.ServiceManager;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-17.
 */
public class ExpiredActivitiesActivity extends BaseActivity{
    private ListView mListView;
    private ActivitiesListAdapter mAdapter;
    private ActionListener listListener = new ActionListener(ExpiredActivitiesActivity.this) {
        @Override
        public void onReceive(int action, Bundle data) {
            if(data == null){
                // TODO
                // showEmptyOrShowError()
                return;
            }
            String str = data.getString("result");
            Log.i("SWall",TAG+" "+str);
            try {
                JSONObject obj = new JSONObject(str);
                JSONObject resultObject = JSONUtils.getJSONObject(obj, "r", new JSONObject());

                JSONArray array = JSONUtils.getJSONArray(resultObject,"activities",new JSONArray());
                mAdapter.setJSONData(array);
            } catch (JSONException e) {
                // DO nothing
                e.printStackTrace();
            }

        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_expired_list);
        mListView = (ListView)findViewById(R.id.expiredlist);
//        ArrayAdapter<String> adapter = new ArrayAdapter<String>(this,android.R.layout.simple_list_item_1,new String[]{
//                "sdfsdfsdf",
//                "sdfsdf",
//                "sdfsdgdf"
//        });
        mAdapter = new ActivitiesListAdapter(this);
        mListView.setAdapter(mAdapter);


        Bundle data = new Bundle();
        data.putString("userName",currentAccount.userName);
        mApp.doAction(ServiceManager.Constants.ACTION_GET_EXPIRED_ACTIVITIES, data, listListener);

    }
}
