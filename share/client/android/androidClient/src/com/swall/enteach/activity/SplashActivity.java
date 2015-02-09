package com.swall.enteach.activity;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.util.Log;
import com.swall.enteach.R;
import com.swall.enteach.services.ActionListener;
import com.swall.enteach.services.ServiceManager;


public class SplashActivity extends BaseActivity {

    private static final int DELAY_TIME = 500;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setTitleVisible(false);
        setContentView(R.layout.activity_splash);




        new Handler().postDelayed(new Runnable() {

            @Override
            public void run() {
                if (!isFinishing()) {

                    SharedPreferences prefs = getSharedPreferences(SettingActivity.PRE_NAME, Context.MODE_PRIVATE);
                    boolean autoLogin =prefs.getBoolean("auto_login", true);

                    if(autoLogin){
                        boolean actionStarted = mApp.doAction(ServiceManager.Constants.ACTION_AUTO_LOGIN,null,new ActionListener(SplashActivity.this){

                            @Override
                            public void onReceive(int action, Bundle data) {
                                Log.i(TAG, "auto login");

                                if(data != null && data.containsKey(ServiceManager.Constants.KEY_USER_NAME)){
                                    gotoMain();
                                }else{
                                    gotoLogin();
                                }
                            }
                        });

                        if(!actionStarted){
                            gotoLogin();
                        }
                    }else{
                        gotoLogin();
                    }
                }
            }
        }, DELAY_TIME);
    }

    private void gotoMain() {
        startActivity(new Intent(SplashActivity.this, MainActivity2.class).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
        finish();
    }

    private void gotoLogin() {
        startActivity(new Intent(SplashActivity.this, LoginActivity.class).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
        finish();
    }
}
