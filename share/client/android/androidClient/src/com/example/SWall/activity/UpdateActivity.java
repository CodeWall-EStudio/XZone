package com.example.SWall.activity;

import android.app.Activity;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.widget.Toast;
import com.example.SWall.R;
import com.umeng.analytics.MobclickAgent;
import com.umeng.update.UmengUpdateAgent;
import com.umeng.update.UmengUpdateListener;
import com.umeng.update.UpdateResponse;

/**
 * Author: iptton
 * Date: 13-12-7
 * Time: 下午9:46
 */
public class UpdateActivity extends BaseActivity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);



        setContentView(R.layout.main);

        MobclickAgent.onEvent(this,"updater");
        UmengUpdateAgent.update(this);
        UmengUpdateAgent.setUpdateAutoPopup(false);
        UmengUpdateAgent.setUpdateListener(new UmengUpdateListener() {
            @Override
            public void onUpdateReturned(int updateStatus,UpdateResponse updateInfo) {
                switch (updateStatus) {
                    case 0: // has update
                        UmengUpdateAgent.showUpdateDialog(UpdateActivity.this, updateInfo);
                        break;
                    case 1: // has no update
                        Toast.makeText(UpdateActivity.this, "已是最新版本", Toast.LENGTH_LONG)
                                .show();

                        break;
                    case 2: // none wifi
                        Toast.makeText(UpdateActivity.this, "非 WIFI 下不执行更新", Toast.LENGTH_SHORT)
                                .show();
                        // 允许用户在非wifi下更新
                        // UmengUpdateAgent.setUpdateOnlyWifi(false);
                        break;
                    case 3: // time out
                        Toast.makeText(UpdateActivity.this, "查询超时，请稍后再试", Toast.LENGTH_SHORT)
                                .show();
                        break;
                }
            }
        });
    }

    @Override
    protected void onResume() {
        super.onResume();
        MobclickAgent.onPageStart("Update");
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPageEnd("Update");
    }
}