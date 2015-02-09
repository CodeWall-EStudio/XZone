package com.swall.tra;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import com.swall.tra.adapter.ActivitiesListAdapter;
import com.swall.tra.model.TRAInfo;
import com.swall.tra.network.ActionListener;
import com.swall.tra.network.ServiceManager;
import com.swall.tra.utils.JSONUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-25.
 */
public class ExpiredActivitiesFrame extends TabFrame implements AdapterView.OnItemClickListener {
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
                    // showEmptyOrShowError()
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
                }

            }
        };
        app.doAction(ServiceManager.Constants.ACTION_GET_EXPIRED_ACTIVITIES, defaultRequestData, listListener);

        return mView;
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
        bundle.putBoolean("joinable", false);
        i.putExtras(bundle);
        startActivity(i);
    }
}
