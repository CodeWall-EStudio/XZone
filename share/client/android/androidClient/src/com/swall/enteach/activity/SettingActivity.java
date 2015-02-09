package com.swall.enteach.activity;

import android.os.Bundle;
import android.preference.Preference;
import android.preference.PreferenceActivity;
import android.preference.PreferenceScreen;
import com.swall.enteach.R;
import com.swall.enteach.services.MyApplication;

/**
 * Created by pxz on 13-12-17.
 */
public class SettingActivity extends PreferenceActivity implements Preference.OnPreferenceClickListener {
    public static final String PRE_NAME = "global_settings";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getPreferenceManager().setSharedPreferencesName(PRE_NAME);
        getPreferenceManager().setSharedPreferencesMode(MODE_PRIVATE);
        addPreferencesFromResource(R.xml.preferences);
        PreferenceScreen account = (PreferenceScreen)findPreference("account");
        account.setSummary("当前登录帐号:"+ MyApplication.getsInstance().getmAccount().userName);
        account.setOnPreferenceClickListener(this);
    }

    @Override
    public boolean onPreferenceClick(Preference preference) {
        String key = preference.getKey();
        if(key == "account"){

        }
    }
}
