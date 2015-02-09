package com.swall.tra.widget;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.view.Gravity;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.TextView;
import com.actionbarsherlock.app.ActionBar;
import com.swall.tra.R;

/**
 * Created by pxz on 14-1-1.
 */
public class CustomDialog extends Dialog implements View.OnClickListener {
    private TextView mPostiveButton;
    private TextView mNegativeButton;
    private TextView mContentTextView;

    public CustomDialog(Context context) {
        super(context);
        init();
    }

    public CustomDialog(Context context, int theme) {
        super(context, theme);
        init();
    }

    public CustomDialog(Context context, boolean cancelable, OnCancelListener cancelListener) {
        super(context, cancelable, cancelListener);
        init();
    }

    private void init() {
        placeToBottom();
        setupContentView();
    }

    private void setupContentView() {
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        setContentView(R.layout.custom_dialog);
        mPostiveButton = (TextView) findViewById(R.id.btn_positive);
        mNegativeButton = (TextView) findViewById(R.id.btn_negative);
        mContentTextView = (TextView)findViewById(R.id.content_text);

        mPostiveButton.setOnClickListener(this);
        mNegativeButton.setOnClickListener(this);
    }

    private void placeToBottom() {
        Window window = getWindow();
        WindowManager.LayoutParams wlp = window.getAttributes();

        wlp.width = WindowManager.LayoutParams.FILL_PARENT;
        wlp.gravity = Gravity.BOTTOM;
        wlp.flags &= ~WindowManager.LayoutParams.FLAG_DIM_BEHIND;
        window.setAttributes(wlp);
    }



    @Override
    public void onClick(View v) {
        switch(v.getId()){
            case R.id.btn_positive:
                dismiss();
                break;
            case R.id.btn_negative:
                cancel();;
                break;
        }
    }

    public CustomDialog setPositiveButton(String str){
        mPostiveButton.setText(str);
        return this;
    }
    public void setMessage(String message){
        mContentTextView.setText(message);
    }
}
