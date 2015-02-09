package com.swall.enteach.activity;

import android.content.Intent;
import android.os.*;
import android.view.View;
import android.widget.TabHost;
import com.swall.enteach.R;

import java.util.HashMap;
import java.util.Map;

/**
 * Author: iptton
 * Date: 13-12-7
 * Time: 下午9:50
 */
public class MainActivity extends BaseActivity implements TabHost.TabContentFactory,  TabHost.OnTabChangeListener{
    private TabHost mTabHost;
    private Map<String,TabFrame> mTabFrames = new HashMap<String,TabFrame>();

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if(android.os.Build.VERSION.SDK_INT >= 11){
            getWindow().setFlags(0x01000000, 0x01000000);//开启硬件加速
        }
        setContentView(R.layout.main);

        mTabHost = (TabHost) findViewById(android.R.id.tabhost);

        initTabs();


    }

    private void initTabs() {
        mTabHost.setup();
        mTabHost.setOnTabChangedListener(this);

        //mTabHost.addTab(getTabSpec(CollectionFrame.class,R.string.collection_tab_name));
        //mTabHost.addTab(getTabSpec(TimelineFrame.class,R.string.timeline_tab_name));
        mTabHost.addTab(getTabSpec(ActiviesFrame.class,R.string.activities_tab_name));
        mTabHost.addTab(getTabSpec(SettingsFrame.class,R.string.settings_tab_name));

    }

    private TabHost.TabSpec getTabSpec(Class<? extends TabFrame> tabFrameClass,int resourceId){
        return getTabSpec(tabFrameClass, getApplicationContext().getResources().getString(resourceId));
    }

    private TabHost.TabSpec getTabSpec(Class<? extends TabFrame> tabFrameClass,String indicator) {
        TabHost.TabSpec tabSpec = mTabHost.newTabSpec(tabFrameClass.getName());
        tabSpec.setIndicator(indicator);
        tabSpec.setContent(this);
        return tabSpec;
    }

    @Override
    public void onTabChanged(String classTag) {
    }

    @Override
    public View createTabContent(String classTag) {
        TabFrame tf = null;
        try {
            tf = (TabFrame)Class.forName(classTag).newInstance();
            tf.setActivity(this);
            mTabFrames.put(classTag, tf);
            return tf.onCreateView(getLayoutInflater());

        } catch (Exception e){
            // do nothing
        }

        return null;
    }

    private TabFrame getCurrentTab(){
        String tag = mTabHost.getCurrentTabTag();
        return mTabFrames.get(tag);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode,resultCode,data);
        getCurrentTab().onActivityResult(requestCode,resultCode,data);
    }


}