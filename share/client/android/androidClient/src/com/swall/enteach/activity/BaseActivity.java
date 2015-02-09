package com.swall.enteach.activity;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import com.swall.enteach.model.AccountInfo;
import com.swall.enteach.services.MyApplication;
import com.umeng.analytics.MobclickAgent;

/**
 * Author: iptton
 * Date: 13-12-7
 * Time: 下午9:34
 */
public class BaseActivity extends Activity{
    protected String TAG;
    protected MyApplication mApp;
    protected AccountInfo currentAccount;
    private View mTitleView;

    public String getCurrentAcccountName(){
        return currentAccount.userName;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

/*

        requestWindowFeature(Window.FEATURE_CUSTOM_TITLE);
        getWindow().setFeatureInt(Window.FEATURE_CUSTOM_TITLE, R.layout.base_title);
        mTitleView = findViewById(R.id.title_layout);
*/
        TAG = getClass().getName();
        mApp = (MyApplication)getApplication();
        //Log.i("SWall",TAG+":onCreate");



        currentAccount = mApp.getmAccount();

    }

    public void setTitleVisible(boolean visible){
        /*
        if(visible){
            mTitleView.setVisibility(View.GONE);
        }else{
            mTitleView.setVisibility(View.GONE);
        }
        */
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
