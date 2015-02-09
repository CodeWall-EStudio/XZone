package com.swall.tra2;

import android.os.Bundle;
import android.view.View;
import com.actionbarsherlock.app.SherlockPreferenceActivity;
import com.swall.tra.TRAApplication;
import com.swall.tra.model.AccountInfo;
import com.swall.tra.network.ServiceManager;
import com.umeng.analytics.MobclickAgent;

/**
 * Created by pxz on 13-12-28.
 */
public class BasePreferenceFragment extends SherlockPreferenceActivity {
    protected TRAApplication app;
    protected String TAG;
    protected AccountInfo currentAccount;
    private View mTitleView;
    protected Bundle defaultRequestData;

    public String getCurrentAcccountName(){
        return currentAccount.userName;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        app = TRAApplication.getApp();
        TAG = BasePreferenceFragment.class.getName();
        //Log.i("SWall",TAG+":onCreate");
        currentAccount = app.getCachedAccount();
        defaultRequestData = new Bundle();
        defaultRequestData.putString(ServiceManager.Constants.KEY_USER_NAME,currentAccount.userName);

    }


    @Override
    public void onResume() {
        //Log.i("SWall",TAG+":onResume");
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    public void onPause() {
        //Log.i("SWall",TAG+":onPause");
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
    public void onDestroy() {
        //Log.i("SWall",TAG+":onDestroy");
        super.onDestroy();
    }
}
