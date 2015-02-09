package com.example.SWall.activity;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import com.example.SWall.R;
import com.example.SWall.services.ActionListener;
import com.example.SWall.services.ServiceManager;

/**
 * Author: iptton
 * Date: 13-12-7
 * Time: 下午9:38
 */
public class LoginActivity extends BaseActivity implements View.OnClickListener {

    ActionListener listener = new ActionListener(LoginActivity.this) {
        @Override
        public void onReceive(int action, Bundle data) {

            switch (action){
                case ServiceManager.Constants.ACTION_LOGIN:
                    dismissLoginProgressDialog();

                    if(data.getBoolean(ServiceManager.Constants.KEY_STATUS,false)){

                        mApp.doAction(ServiceManager.Constants.ACTION_UPDATE_ACCOUNT,mLoginData,null);
                        startActivity(new Intent(LoginActivity.this, MainActivity.class).addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP));
                        Log.i(TAG,"login success");
                        finish();
                    }else{
                        enableLoginActoins();

                        mEtPassword.setText("");
                        mEtUserName.setText("");
                        findViewById(R.id.login_button).setEnabled(true);
                    }
                    break;
                case ServiceManager.Constants.ACTION_GET_ACCOUNTS:
                    if(data == null)return;
                    String[] savedAccountNames = data.getStringArray(ServiceManager.Constants.KEY_SAVED_ACCOUNTS);
                    if(savedAccountNames != null){//不大可能出现,但还是判断下吧
                        updateAccounts(savedAccountNames);
                    }
                    break;
            }
        }
    };


    private Bundle mLoginData;

    private void updateAccounts(String[] accounts) {
        for(String account:accounts){
            mEtUserName.setText(account);

        }
    }


    private CheckBox mCbAutoLogin;
    private EditText mEtUserName;
    private EditText mEtPassword;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        mApp.addObserver(ServiceManager.Constants.ACTION_LOGIN, listener);
        mApp.addObserver(ServiceManager.Constants.ACTION_GET_ACCOUNTS,listener);

        mEtUserName = (EditText)findViewById(R.id.username);
        mEtPassword = (EditText)findViewById(R.id.password);
        mCbAutoLogin = (CheckBox)findViewById(R.id.cb_auto_login);
        findViewById(R.id.login_button).setOnClickListener(this);

        mApp.doAction(ServiceManager.Constants.ACTION_GET_ACCOUNTS,null,null);
    }

    @Override
    public void onDestroy(){
        super.onDestroy();
        mApp.removeObserver(listener);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.login_button:
                mLoginData = new Bundle();
                String userName = mEtUserName.getText().toString();
                mLoginData.putString(ServiceManager.Constants.KEY_USER_NAME, userName);
                mLoginData.putString(ServiceManager.Constants.KEY_PASSWORD, mEtPassword.getText().toString());
                if(mCbAutoLogin.isChecked()){
                    mLoginData.putString(ServiceManager.Constants.KEY_AUTO_LOGIN_ACCOUNT, userName);
                }
                mApp.doAction(ServiceManager.Constants.ACTION_LOGIN,mLoginData,listener);
                disableLoginActions();
                showLoginProgressDialog();
                break;
        }
    }

    private void showLoginProgressDialog() {
        // TODO
    }
    private void dismissLoginProgressDialog(){
        // TODO
    }

    private void enableLoginActoins() {
        //findViewById(R.id.login_status).setVisibility(View.GONE);
        findViewById(R.id.login_button).setEnabled(true);
    }
    private void disableLoginActions() {

        //findViewById(R.id.login_status).setVisibility(View.VISIBLE);
        findViewById(R.id.login_button).setEnabled(false);
    }
}