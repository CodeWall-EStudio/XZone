package com.swall.tra;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Bundle;
import android.os.Parcelable;
import android.provider.MediaStore;
import android.text.TextUtils;
import android.view.View;
import android.widget.*;
import com.swall.tra.adapter.ActivityResourceAdapter;
import com.swall.tra.model.ResourceInfo;
import com.swall.tra.model.TRAInfo;
import com.swall.tra.network.ActionListener;
import com.swall.tra.network.ActionService;
import com.swall.tra.network.ServiceManager;
import com.swall.tra.utils.JSONUtils;
import com.swall.tra.utils.Utils;
import com.swall.tra.widget.CustomDialog;
import com.umeng.update.UmengUpdateAgent;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;

/**
 * Created by pxz on 13-12-28.
 */
public class CurrentTRAActivity extends BaseFragmentActivity implements AdapterView.OnItemClickListener, View.OnClickListener {
    private static final int REQUEST_ID_PHOTO = 0x01;
    private static final int REQUEST_ID_VIDEO = 0x02;
    private static final int REQUEST_ID_TEXT = 0x03;
    ActivityResourceAdapter mAdapter = new ActivityResourceAdapter();
    private ListView mListView;
    private boolean mIsQuiting = false;
    private AlertDialog mQuitDialog;
    private TextView mTitleTips;
    private View mBtnPhoto;
    private View mBtnVideo;
    private View mBtnText;
    private String mFilePath;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        initData();
        initViews();
        initClickListeners();
        initIntents();


        UmengUpdateAgent.update(this);

        UmengUpdateAgent.setUpdateAutoPopup(true);
    }

    private void initData() {
        String str = getIntent().getStringExtra("result");
        mInfo = mAdapter.setJSONData(str);
    }

    private void initViews() {
        setContentView(R.layout.activity_current_tra);
        mListView = (ListView)findViewById(R.id.listview);
        mListView.setOnItemClickListener(this);
        mBtnQuit = findViewById(R.id.btnQuit);
        mTitleTips = (TextView)findViewById(R.id.title_tips);
        if(mInfo == null){
            fetchCurrentActivity();
        }else{

            // header view
            View headerView = getLayoutInflater().inflate(R.layout.tra_info_detail,null,false);
            TextView name = (TextView)headerView.findViewById(R.id.tra_name);
            TextView time = (TextView)headerView.findViewById(R.id.tra_time);
            TextView desc = (TextView)headerView.findViewById(R.id.tra_intro);
            name.setText(mInfo.title);
            time.setText(mInfo.getTimeFormated());
            desc.setText(mInfo.getAllDesc());
            mListView.addHeaderView(headerView);

            mTitleTips.setText(mInfo.title);
        }

        mListView.setAdapter(mAdapter);
        mAdapter.notifyDataSetChanged();


        mBtnPhoto = findViewById(R.id.btnPhoto);
        mBtnText = findViewById(R.id.btnText);
        mBtnVideo = findViewById(R.id.btnRecordVideo);
    }

    @Override
    public void onItemClick(AdapterView<?> parent, View view, int position, long id) {

        ResourceInfo info = (ResourceInfo)parent.getAdapter().getItem(position);
        if(info.type == ServiceManager.Constants.UPLOAD_TYPE_VIDEO){
            Uri uri = Uri.parse(info.content);
            Intent intent = new Intent(Intent.ACTION_VIEW)
                    .setDataAndType(uri, "video/3gp");
            intent.putExtra(Intent.EXTRA_TITLE, "新媒体教研");
            startActivity(intent);
        }else if(info.type == ServiceManager.Constants.UPLOAD_TYPE_IMAGE){
            String url = ActionService.getUrlWithSKEY(info.content);
            if(url.startsWith("http")){
                Intent i = new Intent(this,ImageViewActivity.class);
                i.putExtra("url",url);
                startActivity(i);
            }else{
                // do nothing
            }

        }
    }


    private ActionListener mUploadListener = new ActionListener(this) {
        @Override
        public void onReceive(int action, Bundle data) {
            // TODO
            if(data != null && data.containsKey("result")){
                Toast.makeText(CurrentTRAActivity.this, "上传完成", Toast.LENGTH_SHORT).show();
                fetchCurrentActivity();
            }else{
                Toast.makeText(CurrentTRAActivity.this, "发送失败", Toast.LENGTH_SHORT).show();
            }
        }
    };;
    private AlertDialog mDialog;




    private static final int STATE_LOADING = 0;
    private static final int STATE_NO_ACTIVITY = 1;
    private static final int STATE_HAS_ACTIVITY = 2;
    private Intent mTakePicIntent;
    private Intent mTakeVideoRecordIntent;
    private Intent mWriteTextIntent;
    private Intent mAvailableListIntent;


    private View mBtnQuit;
    private TRAInfo mInfo;


    private void fetchCurrentActivity() {

        app.doAction(ServiceManager.Constants.ACTION_GET_CURRENT_ACTIVITY_INFO,defaultRequestData,new ActionListener(this) {
            @Override
            public void onReceive(int action, Bundle data) {
                String result = "";
                if(data!=null)result = data.getString("result","");
                dealWithData(result);
            }
        });
    }

    private void dealWithData(String str) {
        if(TextUtils.isEmpty(str)){
            return;
        }
        try {
            JSONObject object = new JSONObject(str);
            if(object.has("r")){
                object = JSONUtils.getJSONObject(object, "r", new JSONObject());
                JSONArray array = JSONUtils.getJSONArray(object,"activities",new JSONArray());
                if(array.length() < 1){
                    return;
                }else{
                    object = JSONUtils.arrayGetJSONObject(array,0);
                }
            }
            mInfo = new TRAInfo(object);
            mAdapter.setTRAInfo(mInfo);
        } catch (JSONException e) {
        }
    }



    private void initClickListeners() {
//        findViewById(R.id.btnDraw).setOnClickListener(this);
        mBtnPhoto.setOnClickListener(this);
//        findViewById(R.id.btnRecordAudio).setOnClickListener(this);
        mBtnText.setOnClickListener(this);
        mBtnVideo.setOnClickListener(this);

        mBtnQuit.setOnClickListener(this);
    }

    private void initIntents(){
        mTakePicIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        mTakePicIntent.putExtra(MediaStore.EXTRA_VIDEO_QUALITY, 100);
        mFilePath = Utils.getExternalDir()+"/"+ System.currentTimeMillis()+".jpg";
        mTakePicIntent.putExtra(MediaStore.EXTRA_OUTPUT,Uri.fromFile(new File(mFilePath)));


        mTakeVideoRecordIntent = new Intent(MediaStore.ACTION_VIDEO_CAPTURE);

        // 录像过程中按home ,再次进入时不需再显示
        mTakePicIntent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);
        mTakeVideoRecordIntent.addFlags(Intent.FLAG_ACTIVITY_NO_HISTORY);

//        mTakePicIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        mTakeVideoRecordIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
//        mTakeAudioRecordIntent = new Intent(this,CollectionAudio.class);
        mWriteTextIntent = new Intent(this,AddTextResourceActivity.class);
        mWriteTextIntent.putExtra("title",mInfo.title);

//        mAvailableListIntent = new Intent(this,AvailableActivitiesActivity.class);
    }

    @Override
    public void onClick(View v) {
        int viewId = v.getId();
        int reqId = -1;
        Intent i = null;
        switch (viewId) {
            case R.id.btnPhoto:
                i = mTakePicIntent;
                reqId = REQUEST_ID_PHOTO;
                break;
            case R.id.btnRecordVideo:
                i = mTakeVideoRecordIntent;
                reqId = REQUEST_ID_VIDEO;
                break;
            case R.id.btnText:
                i = mWriteTextIntent;
                reqId = REQUEST_ID_TEXT;
                break;
            case R.id.btn_goto_available_list:
                i = mAvailableListIntent;
                break;
            case R.id.tra_name:
                i = new Intent(this,ResourceListActivity.class);
                i.putExtra("result",mInfo.toString());
                break;
            case R.id.btnQuit:
                confirmQuit();
                break;
            default:
                break;

        }
        if(i != null){
            setCollectionButtonEnabled(false);
            try{
                startActivityForResult(i, reqId);
            }catch(Exception e){//某些机器上启动不了摄像头拍照或录像
                if(viewId == R.id.btnPhoto){
                    Toast.makeText(this, R.string.launch_camera_fail, Toast.LENGTH_LONG).show();
                }
                setCollectionButtonEnabled(true);
            }
        }
    }

    private void gotoMainActivity() {
        Intent i = new Intent(this, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
        startActivity(i);
        finish();
    }
/*
    private void showTextDialog() {
        if(mDialog != null && mDialog.isShowing()){
            mDialog.dismiss();
        }
        // Set an EditText view to get user input
        final EditText input = new EditText(this);
        mDialog  = new AlertDialog.Builder(this)
                .setTitle("添加文字评论")
                .setMessage(mInfo.title)
                .setView(input)
                .setPositiveButton("确认", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int whichButton) {
                        Editable value = input.getText();
                        defaultRequestData.putString("text",value.toString());
                        defaultRequestData.putString("id", mInfo.id);
                        app.doAction(ServiceManager.Constants.ACTION_UPLOAD_TEXT, defaultRequestData, mUploadListener);
                        mDialog.dismiss();
                    }
                }).setNegativeButton("取消", new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int whichButton) {
                        // Do nothing.
                    }
                }).show();
    }
*/

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        setCollectionButtonEnabled(true);
        switch(requestCode){
//            case R.id.btnDraw:// 涂鸦和拍照是同一类型
            case REQUEST_ID_PHOTO:
                if(resultCode == Activity.RESULT_OK){
                    doUpload(data, ServiceManager.Constants.UPLOAD_TYPE_IMAGE, ServiceManager.Constants.ACTION_UPLOAD_PIC);
                }else{
//                    Toast.makeText(this,"cancel",Toast.LENGTH_SHORT).show();
                }
                break;
            case REQUEST_ID_VIDEO:
                if(resultCode == Activity.RESULT_OK){
                    doUpload(data, ServiceManager.Constants.UPLOAD_TYPE_VIDEO, ServiceManager.Constants.ACTION_UPLOAD_VIDEO);
                }else{
//                    Toast.makeText(this,"cancel",Toast.LENGTH_SHORT).show();
                }
                break;
//            case R.id.btnRecordAudio:
//            if(resultCode == Activity.RESULT_OK && data.getExtras() != null){
//                doUpload(data, ServiceManager.Constants.UPLOAD_TYPE_VIDEO, ServiceManager.Constants.ACTION_UPLOAD_AUDIO);
//            }else{
//                Toast.makeText(this,"cancel",Toast.LENGTH_SHORT).show();
//            }
//            break;
            case R.id.btn_goto_available_list:
                if(resultCode == Activity.RESULT_OK){//加入成功，拉一次数据
                    fetchCurrentActivity();
                }
                break;
            case R.id.tra_name:
                break;
            case REQUEST_ID_TEXT:
                if(resultCode == RESULT_OK){
                    doUploadText(data.getStringExtra("text"));
                }
                break;
        }
    }

    private void setCollectionButtonEnabled(boolean enabled) {
        mBtnPhoto.setEnabled(enabled);
        mBtnText.setEnabled(enabled);
        mBtnVideo.setEnabled(enabled);
    }

    private void doUploadText(String text) {
        defaultRequestData.putString("text",text.toString());
        defaultRequestData.putString("id", mInfo.id);
        app.doAction(ServiceManager.Constants.ACTION_UPLOAD_TEXT, defaultRequestData, mUploadListener);
    }


    private void doUpload(Uri videoUri, int uploadTypeVideo, int actionUploadVideo) {
        defaultRequestData.putString("id",mInfo.id);
        defaultRequestData.putParcelable("data",videoUri);

    }

    private void doUpload(Intent data, int uploadTypeVideo,int action) {
        Parcelable dataToTranfer = null;
        switch (action){
            case  ServiceManager.Constants.ACTION_UPLOAD_VIDEO:
                dataToTranfer = data.getData();
                break;
            case ServiceManager.Constants.ACTION_UPLOAD_PIC:{
                Bitmap bitmap=null;
                String filePath = mFilePath;
//                filePath = Utils.getExternalDir()+"videoEngine.log";
                BitmapFactory.Options options = new BitmapFactory.Options();
                options.inPreferredConfig = Bitmap.Config.ARGB_8888;
                defaultRequestData.putString("filePath",filePath);

//                try {
//                    bitmap = BitmapFactory.decodeStream(new FileInputStream(f), null, options);
//                    dataToTranfer = bitmap;
//                    dataToTranfer = (Bitmap) data.getExtras().get("data");
//                } catch (FileNotFoundException e) {
//                    dataToTranfer = (Bitmap)data.getExtras().get("data");
//                    Toast.makeText(CurrentTRAActivity.this,"存储空间不足",Toast.LENGTH_SHORT).show();
//                    e.printStackTrace();
//                } catch(OutOfMemoryError error){
//                    Toast.makeText(CurrentTRAActivity.this,"内存不足",Toast.LENGTH_SHORT).show();
//                    return;
//                }

                break;
            }
            case ServiceManager.Constants.ACTION_UPLOAD_AUDIO:// TODO
                return;
        }
        defaultRequestData.putString("id",mInfo.id);
        defaultRequestData.putParcelable("data",dataToTranfer);
        app.doAction(action,defaultRequestData,mUploadListener);
    }

    CustomDialog mQuitConfirmDialog;
    @Override
    public void onBackPressed() {
        confirmQuit();
    }

    private void confirmQuit() {
        if(mIsQuiting){
            return;
        }
        mIsQuiting = true;
        if(mQuitConfirmDialog == null){
            mQuitConfirmDialog = new CustomDialog(this);
            mQuitConfirmDialog.setCancelable(false);
            mQuitConfirmDialog.setMessage("您确定要退出活动吗？");
            mQuitConfirmDialog.setOnDismissListener(new DialogInterface.OnDismissListener() {

                @Override
                public void onDismiss(DialogInterface dialog) {
                    mIsQuiting = false;
                }
            });
            mQuitConfirmDialog.setOnCancelListener(new DialogInterface.OnCancelListener() {
                @Override
                public void onCancel(DialogInterface dialog) {
                    mQuitConfirmDialog.setMessage("正在退出活动...");
                    quitActivity();
                }
            });
        }
        mQuitConfirmDialog.show();
    }

    private void quitActivity() {
        if(mInfo == null)return;
//        showProgressDialog();
        defaultRequestData.putString("id", mInfo.id);
        app.doAction(ServiceManager.Constants.ACTION_QUIT_ACTIVITY,defaultRequestData,new ActionListener(this) {
            @Override
            public void onReceive(int action, Bundle data) {
//                        fetchCurrentActivity();
                mQuitConfirmDialog.dismiss();
                gotoMainActivity();

            }
        });
    }

    private void showProgressDialog() {
        mQuitDialog = new AlertDialog.Builder(this)
                .setTitle(mInfo.title)
                .setMessage("正在退出活动...")
                .setCancelable(false)
                .create();
        mQuitDialog.show();
    }
}