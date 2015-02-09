package com.swall.enteach.activity;

import android.animation.LayoutTransition;
import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.provider.MediaStore;
import android.view.View;
import android.view.ViewGroup;
import android.widget.*;
import com.swall.enteach.R;
import static com.swall.enteach.services.ServiceManager.Constants;

import com.swall.enteach.services.ActionListener;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-18.
 */
public class TRAInfoActivity extends BaseActivity implements View.OnClickListener {

    private Intent mTakePicIntent;
    private Intent mTakeVideoRecordIntent;
    private Intent mWriteTextIntent;
    private boolean isToolShow;

    private ActionListener mUploadListener = new ActionListener(TRAInfoActivity.this) {
        @Override
        public void onReceive(int action, Bundle data) {
            // TODO
        }
    };
    private ImageButton mBtnHidePanel;
    private TableLayout mMenus;
    private ImageButton mBtnShowPanel;
    private View mRootView;
    private ViewGroup mPanelView;
    private ListView mListView;

    private ImageView previewImage;


    private ActivityResourceAdapter mResourceAdapter = new ActivityResourceAdapter();

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tra_info);

        initViews();
        initClickListeners();
        initIntents();

        initTRAInfo();
        isToolShow = true;


    }

    private void initTRAInfo() {



        Intent i = getIntent();
        String json = i.getStringExtra("json");


        try {

            JSONObject object = new JSONObject(json);

            // setupTitle
            JSONObject info = object.getJSONObject("info");
            String title = info.getString("title");
            String teacher = info.getString("teacher");
            setTitle(teacher+":"+title);

            // setupList
            JSONArray array = object.getJSONArray("resources");
            mResourceAdapter.setJSONData(array);

            mListView.setAdapter(mResourceAdapter);
        } catch (JSONException e) {
            e.printStackTrace();
            Toast.makeText(this,"数据有误 "+json,Toast.LENGTH_SHORT).show();
            finish();
        }
    }


    private void initClickListeners() {
        findViewById(R.id.btnDraw).setOnClickListener(this);
//        findViewById(R.id.btnJoinActivity).setOnClickListener(this);
        findViewById(R.id.btnPhoto).setOnClickListener(this);
        findViewById(R.id.btnRecordAudio).setOnClickListener(this);
        findViewById(R.id.btnRecordVideo).setOnClickListener(this);
        findViewById(R.id.btnText).setOnClickListener(this);

        mBtnHidePanel.setOnClickListener(this);
        mBtnShowPanel.setOnClickListener(this);
    }

    private void initIntents(){
        mTakePicIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        mTakeVideoRecordIntent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
//        mTakeAudioRecordIntent = new Intent(this,CollectionAudio.class);
        mWriteTextIntent = new Intent(this,AddTextActivity.class);


    }


    private void initViews() {
        mBtnHidePanel = (ImageButton)findViewById(R.id.btnHidePanel);
        mBtnShowPanel = (ImageButton)findViewById(R.id.btnShowPanel);
        mMenus = (TableLayout)findViewById(R.id.collection);
        mRootView = findViewById(R.id.root);
        mPanelView = (ViewGroup)findViewById(R.id.panel);
        mListView = (ListView)findViewById(R.id.resourceListView);
        previewImage = (ImageView)findViewById(R.id.upload_preview_image);

    }


    @Override
    public void onClick(View v) {
        int viewId = v.getId();
        Intent i = null;
        switch (viewId) {
            case R.id.btnPhoto:
                i = mTakePicIntent;
                break;
            case R.id.btnRecordVideo:
                i = mTakeVideoRecordIntent;
                break;
            case R.id.btnText:
                i = mWriteTextIntent;
                break;

            case R.id.btnHidePanel:
            case R.id.btnShowPanel:
                //mListView.setLayoutTransition(new LayoutTransition());
                if(isToolShow){
                    mPanelView.setLayoutTransition(new LayoutTransition());
                    mBtnShowPanel.setVisibility(View.VISIBLE);
                    mMenus.setVisibility(View.GONE);
                    mBtnHidePanel.setImageResource(android.R.drawable.arrow_up_float);

                }else{
                    mPanelView.setLayoutTransition(new LayoutTransition());
                    mBtnShowPanel.setVisibility(View.GONE);
                    mMenus.setVisibility(View.VISIBLE);
                    mBtnHidePanel.setImageResource(android.R.drawable.arrow_down_float);
                }
                isToolShow = !isToolShow;
                mRootView.invalidate();
                mPanelView.invalidate();
                break;

            default:
                break;

        }
        if(i != null){
            try{
                startActivityForResult(i, viewId);
            }catch(Exception e){//某些机器上启动不了摄像头拍照或录像
                Toast.makeText(this,R.string.launch_camera_fail,Toast.LENGTH_LONG).show();
            }
        }
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {

        switch(requestCode){
            case R.id.btnPhoto:
                if(resultCode == RESULT_OK){
                    Bitmap photo = (Bitmap) data.getExtras().get("data");
                    previewImage.setImageBitmap(photo);
                }
                break;
            case R.id.btnDraw:
                break;
            case R.id.btnRecordAudio:
                break;
            case R.id.btnRecordVideo:
                break;
            case R.id.btnText:
                if(data == null)return;
                mApp.doAction(Constants.ACTION_UPLOAD_TEXT,data.getExtras(),mUploadListener);
                break;
        }
    }
}