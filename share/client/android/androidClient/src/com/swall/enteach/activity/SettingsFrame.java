package com.swall.enteach.activity;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.TextView;
import com.swall.enteach.R;
import com.swall.enteach.services.MyApplication;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 上午2:37
 */
public class SettingsFrame extends TabFrame implements CompoundButton.OnCheckedChangeListener {
    private TextView mTvCurrentAccount;
    private CheckBox mCbAutoLogin;
    private boolean mInitialized;

    @Override
    public View onCreateView(LayoutInflater inflater) {
        mView = inflater.inflate(R.layout.settings,null);
        mInitialized = false;
        return mView;
    }

    @Override
    public void onResume() {
        super.onResume();
        if(!mInitialized){
            mInitialized = true;
            MyApplication app = getActivity().mApp;
            /*
            String currentAccount = app.getCurrentLoginAccount();
            mTvCurrentAccount = (TextView)mView.findViewById(R.id.tvCurrentLogin);
            mTvCurrentAccount.setText(currentAccount);
            mCbAutoLogin = (CheckBox)mView.findViewById(R.id.cbSettingsAutoLogin);
            boolean isAutoLogin = !TextUtils.isEmpty(mApp.getAutoLoginAccount());
            mCbAutoLogin.setChecked(isAutoLogin);
            mCbAutoLogin.setOnCheckedChangeListener(this);
            */
        }
    }

    @Override
    public void afterCreatView() {
    }

    @Override
    public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
        switch(buttonView.getId()){
            case R.id.cbSettingsAutoLogin:
                break;
        }
    }
}
