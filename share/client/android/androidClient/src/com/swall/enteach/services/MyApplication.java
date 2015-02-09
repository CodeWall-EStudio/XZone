package com.swall.enteach.services;

import android.app.Application;
import android.content.Context;
import android.os.Bundle;
import com.swall.enteach.model.AccountInfo;

/**
 * Created by pxz on 13-12-13.
 */
public class MyApplication extends Application {
    private ServiceManager mServiceManager;
    private LoginService mLoginService;
    private DownloadService mDownloadService;
    private UploadService mUploadService;
    private static MyApplication sInstance;
    private AccountInfo mAccount;


    public ActionListener listener = new ActionListener(null) {
        @Override
        public void onReceive(int action, Bundle data) {
            switch (action){
                case ServiceManager.Constants.ACTION_LOGIN:
                case ServiceManager.Constants.ACTION_AUTO_LOGIN:
                    if(data == null)return;
                    mAccount = new AccountInfo(
                            "-1",// TODO
                            data.getString(ServiceManager.Constants.KEY_USER_NAME),
                            data.getString(ServiceManager.Constants.KEY_PASSWORD));
                    break;
            }
        }
    };
    private DataService mDataService;

    public MyApplication(){
        sInstance = this;
    }

    public static MyApplication getsInstance() {
        return sInstance;
    }


    public boolean doAction(int action,Bundle data,ActionListener listener){
        return mServiceManager.doAction(action,data,listener);
    }


    @Override
    public void onCreate() {
        super.onCreate();
        initServices();
        initVolley();
    }

    private void initVolley() {
        MyVolley.init(getApplicationContext());
    }


    private void initServices() {
        mServiceManager = new ServiceManager(this);

        Context context = getApplicationContext();
        mLoginService = new LoginService(context,mServiceManager);
        mDownloadService = new DownloadService(context,mServiceManager);
        mUploadService = new UploadService(context,mServiceManager);
        mDataService = new DataService(context,mServiceManager);


        mServiceManager.registerServices(
                mLoginService,
                mDownloadService,
                mUploadService,
                mDataService
        );

        mServiceManager.addObserver(new int[]{ServiceManager.Constants.ACTION_AUTO_LOGIN,ServiceManager.Constants.ACTION_LOGIN},listener);
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
        sInstance = null;
    }

    public void addObserver(int action, ActionListener listener) {
        mServiceManager.addObserver(action,listener);
    }

    public void removeObserver(int action, ActionListener listener) {
        mServiceManager.removeObserver(action,listener);
    }
    public void removeObserver(ActionListener listener){
        mServiceManager.removeObserver(listener);
    }

    public AccountInfo getmAccount() {
        return mAccount;
    }
}
