package com.swall.tra;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.support.v4.app.FragmentActivity;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.View;
import android.widget.EditText;
import android.widget.TextView;

/**
 * Created by pxz on 14-1-1.
 */
public class AddTextResourceActivity extends BaseFragmentActivity implements View.OnClickListener, TextWatcher {
    private TextView mTitleTips;
    private EditText mEditText;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_add_text);

        mTitleTips = (TextView)findViewById(R.id.title_tips);
        mTitleTips.setText(getIntent().getStringExtra("title"));
        mEditText = (EditText)findViewById(R.id.editText);

        findViewById(R.id.btnSave).setOnClickListener(this);
        findViewById(R.id.btnAbort).setOnClickListener(this);

        mEditText.addTextChangedListener(this);

        hideQuitButton();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()){
            case R.id.btnAbort:
                finish();
                break;
            case R.id.btnSave:
                Intent intent = new Intent();
                intent.putExtra("text",mEditText.getText().toString());
                setResult(RESULT_OK, intent);
                finish();
                break;
        }
    }

    @Override
    public void beforeTextChanged(CharSequence s, int start, int count, int after) {

    }

    @Override
    public void onTextChanged(CharSequence s, int start, int before, int count) {
        if(TextUtils.isEmpty(s)){
            findViewById(R.id.btnSave).setEnabled(false);
        }else{
            findViewById(R.id.btnSave).setEnabled(true);
        }
    }

    @Override
    public void afterTextChanged(Editable s) {

    }
}