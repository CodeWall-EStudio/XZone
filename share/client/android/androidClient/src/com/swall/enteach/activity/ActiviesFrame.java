package com.swall.enteach.activity;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.ListView;
import com.swall.enteach.R;
import com.swall.enteach.utils.ActivitiesDBHelper;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 上午2:33
 */
public class ActiviesFrame extends TabFrame {
    private ListView mListView;
    private ActivitiesDBHelper mDbHelper;

    @Override
    public View onCreateView(LayoutInflater inflater) {
        mView = inflater.inflate(R.layout.activities,null);
        //mListView = (ListView)findViewById(R.id.listView);
        //mDbHelper = new ActivitiesDBHelper(this.mActivityRef.get());
        //mListView.setAdapter(new ActivitiesAdapter(this.mActivityRef.get(),mDbHelper.getAllActivities(),0));
        return mView;
    }
}
