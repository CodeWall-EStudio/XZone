package com.example.SWall.services;

import android.app.Application;
import android.content.Context;
import android.os.Bundle;

/**
 * Created by pxz on 13-12-13.
 */
public class MyApplication extends Application {
    private ServiceManager mServiceManager;
    private LoginService mLoginService;
    private DownloadService mDownloadService;
    private UploadService mUploadService;



    public boolean doAction(int action,Bundle data,ActionListener listener){
        return mServiceManager.doAction(action,data,listener);
    }


    @Override
    public void onCreate() {
        super.onCreate();
        initServices();
    }

    private void initServices() {
        mServiceManager = new ServiceManager(this);

        Context context = getApplicationContext();
        mLoginService = new LoginService(context,mServiceManager);
        mDownloadService = new DownloadService(context,mServiceManager);
        mUploadService = new UploadService(context,mServiceManager);


        mServiceManager.registerServices(
                mLoginService,
                mDownloadService,
                mUploadService
        );
    }

    @Override
    public void onTerminate() {
        super.onTerminate();
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
}
