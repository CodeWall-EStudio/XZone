package com.swall.enteach.services;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.util.SparseArray;
import com.swall.enteach.utils.AccountDatabaseHelper;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by pxz on 13-12-13.
 */
public class ServiceManager {


    private AccountDatabaseHelper mDBHelper;

    public AccountDatabaseHelper getDBHelper() {
        return mDBHelper;
    }

    public static class Constants{

        //public static final String URL_PREFIX = "http://54.251.49.104:8080/";
        public static final String URL_PREFIX = "http://115.28.55.91:8080/";
        public static String getUpdatesUrl(String uid,Bundle data){
            return URL_PREFIX + "";//TODO
        }

        public static String getActivitiesListUrl(String uid,boolean isActive,int index){
            String url =  URL_PREFIX + String.format("activities?uid=%s&status=%s&index=%d&t=%d",uid,(isActive?"active":"closed"),index,
                    System.currentTimeMillis());
            Log.w("SWall",url);
            return url;
        }
        public static String getPostUrl(String uid,String activityId){
            String url = URL_PREFIX + String.format("activity");
            return url;
        }

        public static final String KEY_USER_NAME            = "username";

        public static final String KEY_PASSWORD             = "password";

        public static final String KEY_ACTION               = "action";
        public static final String KEY_STATUS               = "status";



        public static final String KEY_ACTION_DATA          = "action_data";
        public static final String KEY_AUTO_LOGIN_ACCOUNT   = "auto_login_account";
        public static final String KEY_AUT_LOGIN            = "auto_login";
        public static final String KEY_SAVED_ACCOUNTS       = "saved_accounts";
        public static final int ACTION_LOGIN            = 0x01;
        public static final int ACTION_GET_ACCOUNTS     = 0x02;
        public static final int ACTION_UPDATE_ACCOUNT   = 0x03;
        public static final int ACTION_UPLOAD_PIC       = 0x04;
        public static final int ACTION_UPLOAD_TEXT      = 0x05;
        public static final int ACTION_UPLOAD_VIDEO     = 0x06;
        public static final int ACTION_AUTO_LOGIN       = 0x07;
        public static final int ACTION_LOGOUT           = 0x08;
        public static final int ACTION_CHECK_PASSWORD   = 0x09;
        public static final int ACTION_GET_UPDATES      = 0x0a;
        public static final int ACTION_GET_CURRENT_ACTIVITY_INFO    = 0x0b;
        public static final int ACTION_GET_AVAILABLE_ACTIVITIES     = 0x0c;
        public static final int ACTION_GET_EXPIRED_ACTIVITIES       = 0x0d;
    }

    WeakReference<Context> appContextRef;
    SparseArray<ActionService> actionMap;
    SparseArray<ArrayList<ActionListener>> listeners;


    public ServiceManager(Context context){
        appContextRef = new WeakReference<Context>(context);
        actionMap = new SparseArray<ActionService>();
        listeners = new SparseArray<ArrayList<ActionListener>>();
        mDBHelper = new AccountDatabaseHelper(context);

    }

    /**
     *  注册 service
     * @param services
     * @return
     */
    public boolean registerServices(List<ActionService> services){
        return  registerServices(services.toArray(new ActionService[services.size()]));
    }

    /**
     * 注册 service
     * @param services
     * @return
     */
    public boolean registerServices(ActionService... services){
        for(ActionService service : services){
            int[] actions = service.getActionList();
            for(int action : actions){
                if(actionMap.indexOfKey(action) >= 0){
                    // 同一个action 不应该被多个service注册
                    Log.i("TAG",action+" ");
                    continue;
                }
                actionMap.put(action,service);
            }

        }
        return true;
    }

    /**
     * 执行
     * @param action
     * @param data
     * @param listener
     */
    public boolean doAction(int action, Bundle data, ActionListener listener){
        ActionService service = actionMap.get(action);
        if(service != null){
            Log.i("ServiceManager", "doAction " + action);
            service.doAction(action, data, listener);
            return true;
        }
        return false;
    }

    /**
     * 添加action 监听者
     * @param action
     * @param observer
     */
    public void addObserver(int action,ActionListener observer){
        ArrayList<ActionListener> services = listeners.get(action);
        if(null == services ){
            services = new ArrayList<ActionListener>();
            listeners.put(action, services);
        }

        // 避免重复被添加
        if(!services.contains(observer)){
            services.add(observer);
        }
    }

    /**
     * 添加 action 监听者
     * @param actions
     * @param observer
     */
    public void addObserver(int[] actions,ActionListener observer){
        for(int action : actions){
            addObserver(action,observer);
        }
    }

    /**
     * 删除此observer某个监听
     * @param action
     * @param listener
     */
    public void removeObserver(int action,ActionListener listener){
        ArrayList<ActionListener> listenerList = listeners.get(action);
        if(null != listenerList && listenerList.contains(listener)){
            listenerList.remove(listener);
        }
    }

    /**
     * 删除此observer的所有监听
     * @param listener
     */
    public void removeObserver(ActionListener listener){
        for(int i =  listeners.size()-1;i<=0; i--) {
            int action = listeners.keyAt(i);
            removeObserver(action,listener);
        }
    }

    public void notifyListener(final int action,final Bundle data){
        ArrayList<ActionListener> listenerList = listeners.get(action);
        if(listenerList != null){
            for(final ActionListener listener : listenerList){
                listener.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        listener.onReceive(action,data);
                    }
                });
            }
        }
    }
}
