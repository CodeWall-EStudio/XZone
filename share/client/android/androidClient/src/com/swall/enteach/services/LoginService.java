package com.swall.enteach.services;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import com.swall.enteach.model.AccountInfo;
import com.swall.enteach.services.ServiceManager.Constants;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by pxz on 13-12-13.
 */
public class LoginService extends ActionService {
    private static final String URL_PREFIX = "http://codewall.com/";
    private static final String URL_LOGIN = URL_PREFIX+"login";


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
    }

    private void doGetAccounts(Bundle data, final ActionListener listener) {
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
                    data.putString(Constants.KEY_PASSWORD,accountInfo.userPassword);
                }
                notifyListener(Constants.ACTION_GET_ACCOUNTS,data,listener);
            }
        }).start();
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


    private void doLogin(Bundle data,ActionListener listener){
        String userName = data.getString(Constants.KEY_USER_NAME);
        String password = data.getString(Constants.KEY_PASSWORD);
        if(TextUtils.isEmpty(userName) || TextUtils.isEmpty(password)){
            if(listener != null){
                listener.onReceive(Constants.ACTION_LOGIN, null);
            }
            return;
        }

        if(listener != null && !tmpListenerList.contains(tmpListenerList)){
            tmpListenerList.add(listener);
        }
        if(!isLoginProcessing){
            new LoginAsyncTask().execute(userName,password);
        }
    }

    private class LoginAsyncTask extends AsyncTask<String,Integer,Bundle>{
        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            isLoginProcessing = true;
        }

        @Override
        protected void onPostExecute(final Bundle data) {
            super.onPostExecute(data);
            isLoginProcessing = false;

            ActionService[] as = new ActionService[tmpListenerList.size()];
            notifyListener(Constants.ACTION_LOGIN,data,tmpListenerList.toArray());
        }

        @Override
        protected Bundle doInBackground(String... params) {
            if(params.length != 2)return null;
            String userName = params[0];
            String password = params[1];

            // TODO 不应该用get
            try {
                String responseJson = HttpUtils.get(URL_LOGIN + "/" + userName + "/" + password);
                Log.i(TAG,"response:"+responseJson );
                // JSONObject object = new JSONObject(responseJson);

                Bundle response = new Bundle();
                response.putBoolean(Constants.KEY_STATUS,true);// TODO status应该有多个值表明登录返回状态而不应该只是成功或失败
                response.putString(Constants.KEY_USER_NAME, userName);
                response.putString(Constants.KEY_PASSWORD, password);
                return response;

            } catch(JSONException e2){
                // TODO
                e2.printStackTrace();
            } catch (Exception e) {
                // TODO
                e.printStackTrace();
            }
            return null;
        }
    }

}
