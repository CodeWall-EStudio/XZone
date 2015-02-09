package com.swall.tra2;

import android.os.Bundle;
import com.swall.tra.R;

/**
 * Created by pxz on 13-12-28.
 */
public class SettingFragment extends BasePreferenceFragment {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        addPreferencesFromResource(R.xml.preferences);
    }

    @Override
    public void onResume() {
        super.onResume();
        getSupportActionBar().setSubtitle("Settings");
    }
}
