package com.swall.enteach.services;

import android.app.Activity;
import android.os.Bundle;

import java.lang.ref.WeakReference;

/**
 * Created by pxz on 13-12-13.
 */
public abstract class ActionListener {
    public WeakReference<Activity> activityRef;
    public ActionListener(Activity activity){
        activityRef = new WeakReference<Activity>(activity);
    }
    public void runOnUiThread(Runnable runnable){
        Activity activity = activityRef.get();
        if(activity != null){
            activity.runOnUiThread(runnable);
        }else{
            // 不传activity的情况下，由监听方处理线程问题
            runnable.run();
        }
    }

    // 使用 Bundle 最大的坏处是调用方需要知道 key
    // 使用具体的类对象则编码更加烦琐
    // TODO 后续如果 key 越来越多，需考虑重构为具体的类
    public abstract void onReceive(int action, Bundle data);
}
