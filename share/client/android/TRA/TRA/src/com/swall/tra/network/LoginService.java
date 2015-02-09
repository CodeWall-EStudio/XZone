package com.swall.tra.network;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.StringRequest;
import com.swall.tra.TRAApplication;
import com.swall.tra.model.AccountInfo;
import static com.swall.tra.network.ServiceManager.Constants;

import com.swall.tra.utils.NetworkUtils;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by pxz on 13-12-13.
 */
public class LoginService extends ActionService {
    private static final String URL_PREFIX = "http://codewall.com/";
    private static final String URL_LOGIN = URL_PREFIX+"login";

    private static final String LOGIN_URL = "http://my.71xiaoxue.com/authenticationUser.do";


    private ArrayList<ActionListener> tmpListenerList = new ArrayList<ActionListener>(5);
    private boolean isLoginProcessing = false;

    public LoginService(Context context,ServiceManager manager){
        super(context,manager);
    }

    @Override
    public void doAction(int action, Bundle data, ActionListener listener) {
        switch (action){
            case Constants.ACTION_AUTO_LOGIN:
                doAutoLogin(data,listener);
                break;
            case Constants.ACTION_LOGIN:
                doLogin(data,listener);
                break;
            case Constants.ACTION_GET_ACCOUNTS:
                doGetAccounts(data,listener);
                break;
            case Constants.ACTION_UPDATE_ACCOUNT:
                doUpdateAccount(data,listener);
                break;
        }
    }

    private void doUpdateAccount(final Bundle data,final ActionListener listener){
        /*
        new Thread(new Runnable() {
            @Override
            public void run() {
                boolean autoLogin = data.getBoolean(Constants.KEY_AUT_LOGIN,false);
                String name = data.getString(Constants.KEY_USER_NAME,"");
                String pwd = data.getString(Constants.KEY_PASSWORD,"");


                SharedPreferences sp = contextRef.get().getSharedPreferences(TAG, Context.MODE_PRIVATE);
                SharedPreferences.Editor editor = sp.edit();
                if(autoLogin){
                    editor.putString(Constants.KEY_AUTO_LOGIN_ACCOUNT, name);
                }else{
                    editor.remove(Constants.KEY_AUTO_LOGIN_ACCOUNT);
                }
                editor.commit();

                getDBHelper().updateAccountInfo(name,pwd);
            }
        }).start();
        */
        boolean autoLogin = data.getBoolean(Constants.KEY_AUT_LOGIN,false);
        String name = data.getString(Constants.KEY_USER_NAME,"");
        String pwd = data.getString(Constants.KEY_PASSWORD,"");
        String showName = data.getString(TRAApplication.KEY_SHOW_NAME,"");
        String encodeKey = data.getString(TRAApplication.KEY_ENCODE_KEY,"");
        TRAApplication app = TRAApplication.getApp();
        app.updateCurrentAccount(new AccountInfo(name, pwd,showName,encodeKey), autoLogin);
    }

    private void doGetAccounts(Bundle data, final ActionListener listener) {
        /*
        new Thread(new Runnable() {
            @Override
            public void run() {
                List<AccountInfo> accounts = getDBHelper().getAccountInfoList();

                // 先只传一个帐号吧，多帐号需后面再看
                final Bundle data = new Bundle();
                //data.putParcelableArrayList(Constants.KEY_SAVED_ACCOUNTS,accounts); 需让 AccountInfo 实现 Parcelable
                if(accounts.size() > 0){
                    AccountInfo accountInfo = accounts.get(0);
                    data.putString(Constants.KEY_USER_NAME,accountInfo.userName);
                    data.putString(Constants.KEY_PASSWORD,accountInfo.password);
                }
                notifyListener(Constants.ACTION_GET_ACCOUNTS,data,listener);
            }
        }).start();
        */
        TRAApplication app = TRAApplication.getApp();
        AccountInfo accountInfo = app.getCachedAccount();
        final Bundle result = new Bundle();
        result.putString(Constants.KEY_USER_NAME,accountInfo.userName);
        result.putString(Constants.KEY_PASSWORD,accountInfo.password);
        notifyListener(Constants.ACTION_GET_ACCOUNTS, result,listener);
    }

    private void doAutoLogin(Bundle data, ActionListener listener) {
        Context context = contextRef.get();
        SharedPreferences sp = context.getSharedPreferences(TAG, Context.MODE_PRIVATE);
        String autoLoginUserName = sp.getString(Constants.KEY_AUTO_LOGIN_ACCOUNT, "");
        if(autoLoginUserName.length() != 0){
            // 1. 以此帐号在本地登录

            Bundle response = new Bundle();
            response.putString(Constants.KEY_USER_NAME,autoLoginUserName);
            notifyListener(Constants.ACTION_AUTO_LOGIN,response,listener);
            // 2. TODO 向服务器查询密码是否正确，以应对密码修改的情况
            // doAction(Constants.ACTION_CHECK_PASSWORD,null,null);
        }else{
            notifyListener(Constants.ACTION_AUTO_LOGIN,new Bundle(),listener);
        }
    }

    @Override
    public int[] getActionList() {
        return new int[]{
                Constants.ACTION_AUTO_LOGIN,
                Constants.ACTION_LOGIN,
                Constants.ACTION_GET_ACCOUNTS,// FIXME 如果后续需要多个帐号登录，可使用此 action
                Constants.ACTION_LOGOUT,
                Constants.ACTION_CHECK_PASSWORD, // TODO
                Constants.ACTION_UPDATE_ACCOUNT
        };
    }


    private void doLogin(Bundle data,final ActionListener listener){
        String userName = data.getString(Constants.KEY_USER_NAME);
        String password = data.getString(Constants.KEY_PASSWORD);
        if(TextUtils.isEmpty(userName) || TextUtils.isEmpty(password)){
            if(listener != null){
                listener.onReceive(Constants.ACTION_LOGIN, null);
            }
            return;
        }

        if(listener != null && !tmpListenerList.contains(listener)){
            tmpListenerList.add(listener);
        }
        if(!isLoginProcessing){

            RequestQueue rq = MyVolley.getRequestQueue();

            Map<String,String> params = new HashMap<String,String>();
            params.put("loginName",userName);
            params.put("password",password);

            NetworkUtils.StringRequestWithParams request  = new NetworkUtils.StringRequestWithParams(
                    Request.Method.POST,
                    LOGIN_URL,params,
                    new Response.Listener<String>() {
                        public void onResponse(String response) {
                            Bundle result = new Bundle();
                            result.putBoolean(Constants.KEY_STATUS,true);
                            result.putString("result",response);
                            notifyListener(Constants.ACTION_LOGIN,result,tmpListenerList);
                            tmpListenerList.clear();

                        }
                    },
                    new Response.ErrorListener() {
                        @Override
                        public void onErrorResponse(VolleyError error) {
                            // TODO 分别处理网络错误
                            notifyListener(Constants.ACTION_LOGIN,null,tmpListenerList);
                            tmpListenerList.clear();
                        }
                    }
            );
            rq.add(request);
            rq.start();
//            new LoginAsyncTask().execute(userName,password);
        }
    }
}
