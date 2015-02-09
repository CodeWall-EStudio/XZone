package com.swall.tra;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import com.swall.tra.model.AccountInfo;
import com.swall.tra.network.ServiceManager;
import com.umeng.analytics.MobclickAgent;

/**
 * Created by ippan on 13-12-24.
 */
public abstract class BaseActivity extends Activity {
    protected TRAApplication app;
    protected String TAG;
    protected AccountInfo currentAccount;
    private View mTitleView;
    protected Bundle defaultRequestData;

    public String getCurrentAcccountName(){
        return currentAccount.userName;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        app = TRAApplication.getApp();
        TAG = getClass().getName();
        //Log.i("SWall",TAG+":onCreate");
        currentAccount = app.getCachedAccount();
        defaultRequestData = new Bundle();
        defaultRequestData.putString(ServiceManager.Constants.KEY_USER_NAME,currentAccount.userName);

    }


    @Override
    protected void onResume() {
        //Log.i("SWall",TAG+":onResume");
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        //Log.i("SWall",TAG+":onPause");
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
    protected void onDestroy() {
        //Log.i("SWall",TAG+":onDestroy");
        super.onDestroy();
    }
    @Override
    public void onBackPressed()
    {

        //super中会调用fragments.pop，其中可能抛IllegalStateException
        //参考 http://stackoverflow.com/questions/7575921/illegalstateexception-can-not-perform-this-action-after-onsaveinstancestate-h
        try {
            super.onBackPressed();
        } catch (Throwable e) {
            finish();

        }
    }

}
