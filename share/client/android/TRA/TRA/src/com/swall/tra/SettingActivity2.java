package com.swall.tra;

import android.view.LayoutInflater;
import android.view.View;
import android.widget.TextView;
import com.swall.tra.model.AccountInfo;

/**
 * Created by pxz on 13-12-25.
 */
public class SettingActivity2 extends TabFrame implements View.OnClickListener {
    private TextView mTvUserName;

    @Override
    public View onCreateView(LayoutInflater inflater) {
        mView = inflater.inflate(R.layout.activiy_settings,null);
        mView.findViewById(R.id.btnLogout).setOnClickListener(this);
        mTvUserName = (TextView)mView.findViewById(R.id.tvCurrentLogin);
        mTvUserName.setText(getActivity().getCurrentAcccountName());
        return mView;
    }

    @Override
    public void onClick(View v){
        TRAApplication.getApp().updateCurrentAccount(new AccountInfo("","","",""));
        getActivity().finish();
    }
}
