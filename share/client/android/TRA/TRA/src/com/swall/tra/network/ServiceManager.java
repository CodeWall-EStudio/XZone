package com.swall.tra.network;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.util.SparseArray;
import com.swall.tra.utils.AccountDatabaseHelper;

import java.lang.ref.WeakReference;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by pxz on 13-12-13.
 */
public class ServiceManager {

    public static final int TYPE_TEXT = 0;

    private AccountDatabaseHelper mDBHelper;

    public AccountDatabaseHelper getDBHelper() {
        return mDBHelper;
    }

    public static class Constants{

        //public static final String URL_PREFIX = "http://54.251.49.104:8080/";
        public static final String URL_PREFIX = "http://115.28.55.91:8080/";
//        public static final String URL_PREFIX = "http://szone.71xiaoxue.com/";
        public static final String KEY_LOGIN_SUCCESS = "success";
        public static final String KEY_LOGIN_RESULT_OBJECT = "resultObject";
        public static final String KEY_RESULT = "result";

        public static String getPostResourceUrl(String aid, String uid){
            String url =  URL_PREFIX + String.format("activities/%s/resources?uid=%s",aid,URLEncoder.encode(uid));//TODO
            Log.w("SWall",url);
            return url;
        }

        public static String getActivitiesListUrl(String uid,boolean isActive,int index,boolean joined){
            String url =  URL_PREFIX + String.format("activities?uid=%s&status=%s&index=%d&authorize=%s&t=%d",
                    URLEncoder.encode(uid),
                    (isActive ? "active" : "closed"),
                    index,
                    joined?"joined":"available",
                    System.currentTimeMillis());
            Log.w("SWall", url);
            return url;
        }

        public static String getJoinUrl(String userName, String id) {
            String url = URL_PREFIX + String.format("activities/%s/participators?uid=%s",id,URLEncoder.encode(userName));
            Log.w("SWall", url);
            return url;
        }

        public static String getQuitUrl(String uid, String aid) {
            String url = URL_PREFIX + String.format("activities/%s/participators/%s?uid=%s",aid,URLEncoder.encode(uid), URLEncoder.encode(uid));
            Log.w("Swall",url);
            return url;
        }


        public static String getPostUrl(String uid,String activityId){
            String url = URL_PREFIX + String.format("activity");
            return url;
        }

        public static final String KEY_USER_NAME            = "userName";
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
        public static final int ACTION_JION_ACTIVITY                = 0x0e;
        public static final int ACTION_QUIT_ACTIVITY                = 0x0f;
        public static final int ACTION_UPLOAD_AUDIO                 = 0x10;

        public static final int UPLOAD_TYPE_TEXT = 0;
        public static final int UPLOAD_TYPE_IMAGE = 1;
        public static final int UPLOAD_TYPE_VIDEO = 2;
        public static final int UPLOAD_TYPE_AUDIO = 3;

        public static String getUploadedFilPath(String filePath) {
            return URL_PREFIX+"resources/"+filePath;
        }
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
                    Log.i("TAG", action + " ");
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
