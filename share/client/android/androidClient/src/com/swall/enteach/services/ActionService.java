package com.swall.enteach.services;

import android.content.Context;
import android.os.Bundle;
import com.swall.enteach.utils.AccountDatabaseHelper;

import java.lang.ref.WeakReference;

/**
 * Created by pxz on 13-12-13.
 */
public abstract class ActionService {
    protected String TAG;
    protected WeakReference<Context> contextRef;
    protected WeakReference<ServiceManager> managerRef;
    public ActionService(Context context, ServiceManager manager){
        if(context == null || manager == null)throw new Error("ActionService should init with Context and ServiceManager");

        contextRef = new WeakReference<Context>(context);
        managerRef = new WeakReference<ServiceManager>(manager);
        TAG = this.getClass().getSimpleName();
    }
    protected void notifyListener(final int action, final Bundle data,final ActionListener localListener){
        if(localListener != null){
            localListener.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    localListener.onReceive(action,data);
                }
            });
        }

        ServiceManager manager =managerRef.get();
        if(manager != null){
            manager.notifyListener(action, data);
        }
    }
    protected void notifyListener(final int action, final Bundle data,Object... localListeners){
        if(localListeners != null){
            for(Object listenerObj:localListeners){
                if(listenerObj instanceof ActionListener){
                    final ActionListener listener = (ActionListener)listenerObj;
                    listener.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        listener.onReceive(action,data);
                    }
                });
                }
            }
        }

        ServiceManager manager =managerRef.get();
        if(manager != null){
            manager.notifyListener(action, data);
        }
    }
    protected AccountDatabaseHelper getDBHelper(){
        ServiceManager manager =managerRef.get();
        return manager.getDBHelper();
    }
    public void doAction(final int action, final Bundle data, final ActionListener callback){
        // do nothing but call the callback?
        callback.runOnUiThread(new Runnable() {
            @Override
            public void run() {
                callback.onReceive(action,null);
            }
        });
    }
    public abstract int[] getActionList();
}
