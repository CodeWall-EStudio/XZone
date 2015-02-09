package com.swall.enteach.activity;

import android.app.Activity;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import com.swall.enteach.services.MyApplication;

import java.lang.ref.WeakReference;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 上午2:02
 */
public abstract class TabFrame {
    protected WeakReference<BaseActivity> mActivityRef;
    protected MyApplication mApp;
    protected View mView;
    protected BaseActivity getActivity(){
        return mActivityRef.get();
    }

    public void setActivity(BaseActivity activity){
        mActivityRef = new WeakReference<BaseActivity>(activity);
        mApp = activity.mApp;
    }
    public void startActivityForResult(Intent i,int reqCode){
        getActivity().startActivityForResult(i,reqCode);
    }

    public void startActivity(Intent i){
        Activity activity = mActivityRef.get();
        if(activity != null){
            activity.startActivity(i);
        }
    }

    public boolean onActivityResult(int requestCode, int resultCode, Intent data){
        return false;
    }
    public View findViewById(int resouceId){
        return mView.findViewById(resouceId);
    }

    public void onDestroy(){
        if(mActivityRef != null){
            mActivityRef.clear();
        }

    }
    public abstract View onCreateView(LayoutInflater inflater);
}
