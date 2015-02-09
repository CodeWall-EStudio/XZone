package com.swall.tra;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import com.swall.tra.model.AccountInfo;
import com.swall.tra.network.*;
import org.json.JSONArray;

import java.util.*;

/**
 *
 * 先不使用数据库而是全使用 SharedReferences
 *
 * Created by ippan on 13-12-24.
 */
public class TRAApplication extends Application {

    public static final String LIST_TYPE_AVAILABLE = "available_list";
    public static final String LIST_TYPE_EXPIRED = "expired_list";
    public static final String LIST_TYPE_RESOURCES = "resource_list";
    public static final String KEY_SP_CONTENT = "content";

    public static final String CACHED_USER_DATA = "user_data";
    public static final String KEY_USER_NAME = "user_name";
    public static final String KEY_USER_PASSWORD = "user_pwd";
    private static final String KEY_AUTO_LOGIN = "auto_login";
    public static final String KEY_SHOW_NAME = "show_name";
    public static final String KEY_ENCODE_KEY = "encode_key";


    private ServiceManager mServiceManager;
    private LoginService mLoginService;
    private DownloadService mDownloadService;
    private UploadService mUploadService;
    private static TRAApplication sInstance;
    private AccountInfo mAccount;


    public ActionListener listener = new ActionListener(null) {
        @Override
        public void onReceive(int action, Bundle data) {
            switch (action){
                case ServiceManager.Constants.ACTION_LOGIN:
                case ServiceManager.Constants.ACTION_AUTO_LOGIN:
                    if(data == null)return;
                    mAccount = new AccountInfo(
                            data.getString(KEY_USER_NAME),
                            data.getString(KEY_USER_PASSWORD),
                            data.getString(KEY_SHOW_NAME),
                            data.getString(KEY_ENCODE_KEY));
                    break;
            }
        }
    };
    private DataService mDataService;

    public TRAApplication(){
        sInstance = this;
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

        mServiceManager.addObserver(new int[]{ServiceManager.Constants.ACTION_AUTO_LOGIN, ServiceManager.Constants.ACTION_LOGIN},listener);
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

    public static TRAApplication getApp(){
        return sInstance;
    }

    // ###########
    public AccountInfo getCachedAccount(){
        Map<String,String> data = getMappingData(CACHED_USER_DATA,new String[]{KEY_USER_NAME,KEY_USER_PASSWORD,KEY_SHOW_NAME,KEY_ENCODE_KEY});
        String name = data.get(KEY_USER_NAME);
        String password = data.get(KEY_USER_PASSWORD);
        String showName = data.get(KEY_SHOW_NAME);
        String encodeKey = data.get(KEY_ENCODE_KEY);
        if(TextUtils.isEmpty(name) || TextUtils.isEmpty(password)){
            return new AccountInfo("","","","");
        }
        return new AccountInfo(name,password,showName,encodeKey);
    }

    public void updateCurrentAccount(AccountInfo account){
        updateCurrentAccount(account,true);
    }

    public void updateCurrentAccount(AccountInfo account,boolean autoLogin){
        if(account == null){
            account = new AccountInfo("","","","");
        }
        ActionService.sEncodeKey = account.encodeKey;
        saveMappingData(CACHED_USER_DATA,
                new String[]{KEY_USER_NAME,KEY_USER_PASSWORD,KEY_AUTO_LOGIN,KEY_SHOW_NAME,KEY_ENCODE_KEY},
                new String[]{account.userName,account.password,autoLogin?"true":"false",account.showName,account.encodeKey}
        );
    }



    // ############ 基本接口，后续可换为 SQLite ####################

    private boolean saveMappingData(String cacheType, String[] keys, String[] valuse) {
        return saveMappingData(cacheType,  Arrays.asList(keys),  Arrays.asList(valuse));
    }

    private boolean saveMappingData(String cacheType, List<String> keys, List<String> values) {
        if(keys.size() != values.size()){
            throw new Error("key size not match with value size!");
        }
        SharedPreferences.Editor editor = getSharedPreferencesEditor(cacheType);
        for(int i=0;i<keys.size();++i){
            String key = keys.get(i);
            String value = values.get(i);
            editor.putString(key,value);
        }
        return editor.commit();
    }

    public Map<String,String> getMappingData(String cacheType,String[] keys){
        return getMappingData(cacheType, Arrays.asList(keys));
    }
    public Map<String,String> getMappingData(String cacheType,List<String> keys){
        if(keys.isEmpty()){
            return Collections.EMPTY_MAP;
        }

        Map<String, String> result = new HashMap<String, String>(keys.size());
        SharedPreferences sp = getSharedPreferences(cacheType);
        for(String key : keys){
            result.put(key, sp.getString(key, ""));
        }
        return result;
    }
    public String getCachedData(String cacheType,String key){
        return getCachedData(cacheType, key, "");
    }
    public String getCachedList(String listType){
        return getCachedData(listType, KEY_SP_CONTENT, "[]");
    }

    public String getCachedData(String cacheType,String key,String defaultValue){
        SharedPreferences sp = getSharedPreferences(cacheType);
        return sp.getString(key, defaultValue);
    }
    public boolean updateCachedData(String listType,String updatedStr){
        SharedPreferences.Editor editor = getSharedPreferencesEditor(listType);
        editor.putString(KEY_SP_CONTENT,updatedStr);
        return editor.commit();
    }

    public boolean removeCachedData(String cacheType){
        SharedPreferences.Editor editor = getSharedPreferencesEditor(cacheType);
        editor.clear();
        return editor.commit();
    }
    public boolean removeCachedData(String cacheType,String key){
        SharedPreferences.Editor editor = getSharedPreferencesEditor(cacheType);
        editor.remove(key);
        return editor.commit();
    }


    private SharedPreferences getSharedPreferences(String name){
        return getApplicationContext().getSharedPreferences(name, MODE_PRIVATE);
    }
    private SharedPreferences.Editor getSharedPreferencesEditor(String name){
        return getSharedPreferences(name).edit();
    }
    // ############ 基本接口END  ####################

}
