package com.swall.enteach.activity;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import com.swall.enteach.R;
import com.swall.enteach.services.ServiceManager;

/**
 * Created by pxz on 13-12-21.
 */
public class AddTextActivity extends Activity implements View.OnClickListener {
    private static final String SAVED_TEXT = "saved_text";
    private Button mSendButton;
    private Button mCancelButton;
    private EditText mEditText;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_text);

        initViews();

        restoreText();
    }

    private void restoreText() {
        SharedPreferences sp = getSharedPreferences(getClass().getName(),MODE_PRIVATE);
        String txt = sp.getString(SAVED_TEXT,"");
        mEditText.setText(txt);
    }

    private void saveTextAndFinish() {
        SharedPreferences sp = getSharedPreferences(getClass().getName(),MODE_PRIVATE);
        SharedPreferences.Editor editor = sp.edit();
        editor.putString(SAVED_TEXT,mEditText.getText().toString());
        editor.commit();
        finish();
    }


    private void setTextToSendAndFinish() {
        Intent result = new Intent();
        result.putExtra("data",mEditText.getText().toString());
        result.putExtra("type",0);
        setResult(ServiceManager.Constants.ACTION_UPLOAD_TEXT,result);
        finish();
    }

    private void initViews() {

        mSendButton = (Button)findViewById(R.id.btnSend);
        mCancelButton = (Button)findViewById(R.id.btnCancel);
        mEditText = (EditText)findViewById(R.id.etTextToSend);
        mSendButton.setOnClickListener(this);
        mCancelButton.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnSend:
                setTextToSendAndFinish();
                break;
            case R.id.btnCancel:
            default:
                saveTextAndFinish();
                break;
        }
    }


}