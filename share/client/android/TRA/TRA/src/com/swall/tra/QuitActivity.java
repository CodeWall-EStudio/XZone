package com.swall.tra;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.TextView;
import com.swall.tra.model.AccountInfo;

/**
 * Created by pxz on 14-1-1.
 */
public class QuitActivity extends BaseFragmentActivity implements View.OnClickListener {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_quit);


        findViewById(R.id.btnBack).setOnClickListener(this);
        findViewById(R.id.btnQuit).setOnClickListener(this);
        ((TextView)findViewById(R.id.username)).setText(currentAccount.showName);

        hideQuitButton();
    }

    @Override
    public void onClick(View v) {
        switch(v.getId()){
            case R.id.btnQuit:
                gotoLogin();
                break;
            case R.id.btnBack:
                finish();
                break;
        }
    }

    private void gotoLogin() {
        app.updateCurrentAccount(new AccountInfo("", "","",""));
        Intent intent = new Intent(this,LoginActivity.class).setFlags(Intent.FLAG_ACTIVITY_CLEAR_TASK|Intent.FLAG_ACTIVITY_CLEAR_TOP|
            Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(intent);
        finish();
    }
}