package com.swall.tra;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import com.swall.tra.model.AccountInfo;
import com.swall.tra.network.ServiceManager;

import java.lang.ref.WeakReference;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 上午2:02
 */
public abstract class TabFrame {

    protected String TAG;
    protected AccountInfo currentAccount;
    private View mTitleView;
    protected Bundle defaultRequestData;

    protected WeakReference<BaseFragmentActivity> mActivityRef;
    protected TRAApplication app;
    protected View mView;
    protected BaseFragmentActivity getActivity(){
        return mActivityRef.get();
    }


    public void setActivity(BaseFragmentActivity activity){
        mActivityRef = new WeakReference<BaseFragmentActivity>(activity);
        app = activity.app;

        TAG = getClass().getName();
        //Log.i("SWall",TAG+":onCreate");
        currentAccount = app.getCachedAccount();
        defaultRequestData = new Bundle();
        defaultRequestData.putString(ServiceManager.Constants.KEY_USER_NAME,currentAccount.userName);
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
