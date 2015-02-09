package com.example.SWall.activity;

import android.app.Activity;
import android.os.Bundle;
import com.example.SWall.services.MyApplication;
import com.umeng.analytics.MobclickAgent;

/**
 * Author: iptton
 * Date: 13-12-7
 * Time: 下午9:34
 */
public class BaseActivity extends Activity{
    protected String TAG;
    protected MyApplication mApp;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        TAG = getClass().getName();
        mApp = (MyApplication)getApplication();
        //Log.i("SWall",TAG+":onCreate");
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
