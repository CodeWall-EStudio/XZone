package com.swall.tra;

import android.os.Bundle;
import android.preference.Preference;
import android.preference.PreferenceActivity;
import android.preference.PreferenceScreen;
import com.swall.tra.model.AccountInfo;

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
        account.setSummary("当前登录帐号:"+ TRAApplication.getApp().getCachedAccount().userName);

        account.setOnPreferenceClickListener(this);
    }

    @Override
    public boolean onPreferenceClick(Preference preference) {
        String key = preference.getKey();
        if(key.equals("account")){
            TRAApplication.getApp().updateCurrentAccount(null);
            finish();
            return true;
        }
        return false;
    }
}
