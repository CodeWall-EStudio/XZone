package com.swall.tra2;

import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.view.View;
import android.widget.Toast;
import com.actionbarsherlock.app.ActionBar;
import com.actionbarsherlock.app.SherlockListActivity;
import com.actionbarsherlock.view.Menu;
import com.actionbarsherlock.view.MenuItem;
import com.swall.tra.R;
import com.swall.tra.TRAApplication;
import com.swall.tra.model.AccountInfo;
import com.swall.tra.network.ServiceManager;
import com.umeng.analytics.MobclickAgent;

/**
 * Created by pxz on 13-12-28.
 */
public class BaseListActivity extends SherlockListActivity {
    public TRAApplication app;
    protected String TAG;
    protected AccountInfo currentAccount;
    private View mTitleView;
    protected Bundle defaultRequestData;
    private boolean mShowQuitButton;

    public String getCurrentAcccountName(){
        return currentAccount.userName;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        if(mShowQuitButton){
            menu.add("")
                    .setIcon(R.drawable.logout_icon)
                    .setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS);
        }
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onMenuItemSelected(int featureId, MenuItem item) {
        Toast.makeText(this, "quit", Toast.LENGTH_SHORT).show();
        app.updateCurrentAccount(new AccountInfo("","","",""));
        finish();
        return super.onMenuItemSelected(featureId, item);
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


        ActionBar actionBar = getSupportActionBar();
        if(actionBar != null){
            actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);

            actionBar.setBackgroundDrawable(new ColorDrawable(Color.parseColor("#224888")));
        }


        showQuitButton();

    }


    public void showQuitButton(){
        mShowQuitButton = true;
    }
    public void hideQuitButton(){
        mShowQuitButton = false;
        invalidateOptionsMenu();

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
