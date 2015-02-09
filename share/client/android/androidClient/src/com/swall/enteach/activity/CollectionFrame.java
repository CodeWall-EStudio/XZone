package com.swall.enteach.activity;

import android.app.Activity;
import android.content.Intent;
import android.provider.MediaStore;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Toast;
import com.swall.enteach.R;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 上午1:17
 */
public class CollectionFrame extends TabFrame implements View.OnClickListener {

    private Intent mTakePicIntent;
    private Intent mTakeVideoRecordIntent;


    private void initClickListeners() {
        findViewById(R.id.btnDraw).setOnClickListener(this);
//        findViewById(R.id.btnJoinActivity).setOnClickListener(this);
        findViewById(R.id.btnPhoto).setOnClickListener(this);
        findViewById(R.id.btnRecordAudio).setOnClickListener(this);
        findViewById(R.id.btnRecordVideo).setOnClickListener(this);
        findViewById(R.id.btnText).setOnClickListener(this);
    }

    private void initIntents(){
        mTakePicIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        mTakeVideoRecordIntent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);
        //mTakeAudioRecordIntent = new Intent(this,CollectionAudio.class);
        //mWriteTextIntent = new Intent(this,CollectionTextActivity.class);

    }



    @Override
    public void onResume() {
        super.onResume();
    }


    @Override
    public void onStop() {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void onDestroy() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater) {
        mView = inflater.inflate(R.layout.collection,null);
        initClickListeners();
        initIntents();
        return mView;
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
            default:
                break;

        }
        if(i != null){
            try{
                startActivityForResult(i, viewId);
            }catch(Exception e){//某些机器上启动不了摄像头拍照或录像
                Toast.makeText(getActivity(),R.string.launch_camera_fail,Toast.LENGTH_LONG).show();
            }
        }
    }


    @Override
    public boolean onActivityResult(int requestCode, int resultCode, Intent data) {
        if(resultCode != Activity.RESULT_OK){
            Toast.makeText(getActivity(),"取消",Toast.LENGTH_LONG).show();
            return false;
        }
        switch(requestCode){
            case R.id.btnPhoto:

                break;
        }
        return true;
    }
}