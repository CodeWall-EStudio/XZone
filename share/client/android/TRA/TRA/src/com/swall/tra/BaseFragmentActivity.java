package com.swall.tra;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import com.actionbarsherlock.app.ActionBar;
import com.actionbarsherlock.app.SherlockFragmentActivity;
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
public class BaseFragmentActivity extends SherlockFragmentActivity{
    public TRAApplication app;
    protected String TAG;
    protected AccountInfo currentAccount;
    private View mTitleView;
    protected Bundle defaultRequestData;
    private boolean mShowQuitButton;
    protected MenuItem mMenuItemQuit;
    private AlertDialog mQuitProgramConfirmDialog;





    public String getCurrentAcccountName(){
        return currentAccount.userName;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        menu.clear();
        if(mShowQuitButton){
            mMenuItemQuit = menu.add("注销帐号")
                    .setIcon(R.drawable.logout_icon);
            mMenuItemQuit.setShowAsAction(MenuItem.SHOW_AS_ACTION_ALWAYS);
        }
//        menu.add("设置").setIcon(R.drawable.setting_icon);
        return super.onCreateOptionsMenu(menu);
    }

    @Override
    public boolean onMenuItemSelected(int featureId, MenuItem item) {
        if(item == mMenuItemQuit){
//            confirnQuitProgram();
            startActivity(new Intent(this,QuitActivity.class));
        }
        return super.onMenuItemSelected(featureId, item);
    }

    private void confirnQuitProgram() {
        if(mQuitProgramConfirmDialog == null){
            mQuitProgramConfirmDialog = new AlertDialog.Builder(this)
                    .setTitle("是否注销本帐号?")
                    .setCancelable(false)
                    .setNegativeButton("取消", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            mQuitProgramConfirmDialog.dismiss();
                        }
                    })
                    .setPositiveButton("退出", new DialogInterface.OnClickListener() {
                        @Override
                        public void onClick(DialogInterface dialog, int which) {
                            mQuitProgramConfirmDialog.dismiss();
                            app.updateCurrentAccount(new AccountInfo("", "","",""));
                            finish();
                        }
                    })
                    .create();
        }
        mQuitProgramConfirmDialog.show();
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
            actionBar.setCustomView(R.layout.title_bar);
            actionBar.setNavigationMode(ActionBar.NAVIGATION_MODE_STANDARD);
            actionBar.setIcon(R.drawable.icon);
            actionBar.setDisplayOptions(ActionBar.DISPLAY_SHOW_CUSTOM);
            actionBar.setDisplayShowCustomEnabled(true);
            actionBar.setBackgroundDrawable(getResources().getDrawable((R.color.bg)));
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
        Log.i("SWall", TAG + ":onDestroy");
        super.onDestroy();
    }
}
