package com.swall.tra;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.TextView;
import android.widget.Toast;
import com.swall.tra.model.TRAInfo;
import com.swall.tra.network.ActionListener;
import com.swall.tra.network.ServiceManager;
import com.swall.tra.utils.JSONUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-28.
 */
public class TRAInfoActivity extends BaseFragmentActivity implements View.OnClickListener {

    private TextView mName;
    private TextView mTime;
    private TextView mDesc;
    private View mJoinButton;
    private TRAInfo mInfo;
    private ProgressDialog mJoiningDialog;
    private View mBackButton;
    private View mViewResourcesButton;

    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_tra_info);

        initViews();

        if(initData()){
            Toast.makeText(this,"数据出错",Toast.LENGTH_SHORT).show();
            finish();
        }

//        hideQuitButton();
    }

    // TODO 此方法名有问题
    private boolean initData() {
        Intent intent = getIntent();
        if(intent != null){
            Bundle data = intent.getExtras();
            return dealWithData(data);
        }else{
            return false;
        }

    }

    private void fetchCurrentActivity() {

        app.doAction(ServiceManager.Constants.ACTION_GET_CURRENT_ACTIVITY_INFO,defaultRequestData,new ActionListener(this) {
            @Override
            public void onReceive(int action, Bundle data) {
                dealWithData(data);
            }
        });
    }

    protected boolean dealWithData(Bundle data) {
        if(data == null){
//            setState(STATE_NO_ACTIVITY);
            return false;
        }
        String str = data.getString("result");
        try {
            JSONObject object = new JSONObject(str);
            if(object.has("r")){
                object = JSONUtils.getJSONObject(object, "r", new JSONObject());
                JSONArray array = JSONUtils.getJSONArray(object,"activities",new JSONArray());
                if(array.length() < 1){
//                    setState(STATE_NO_ACTIVITY);
                    return false;
                }else{
                    object = JSONUtils.arrayGetJSONObject(array,0);
                }
            }
            TRAInfo info = new TRAInfo(object);
            initTRAInfo(info);
//            setState(STATE_HAS_ACTIVITY);
        } catch (JSONException e) {
//            setState(STATE_NO_ACTIVITY);
        }
        return false;
    }



    private void initTRAInfo(TRAInfo info) {
        this.mInfo = info;
        mName.setText(info.title);
        mTime.setText(info.getTimeFormated());
        mDesc.setText(info.getAllDesc());
        if(mInfo.activeStatus){
            mJoinButton.setVisibility(View.VISIBLE);
            mViewResourcesButton.setVisibility(View.GONE);
        }else{
            mJoinButton.setVisibility(View.GONE);
            mViewResourcesButton.setVisibility(View.VISIBLE);
        }

    }




    private void initViews() {
        mJoinButton = findViewById(R.id.btn_join);
        mBackButton = findViewById(R.id.btn_back);
        mViewResourcesButton = findViewById(R.id.btn_view_resource);

        mName = (TextView)findViewById(R.id.tra_name);
        mTime = (TextView)findViewById(R.id.tra_time);
        mDesc = (TextView)findViewById(R.id.tra_intro);


        mJoinButton.setOnClickListener(this);
        mBackButton.setOnClickListener(this);
        mViewResourcesButton.setOnClickListener(this);
    }


    @Override
    public void onClick(View v) {
        int viewId = v.getId();
        Intent i = null;
        switch (viewId) {
            case R.id.btn_join:
                showJoiningDialog();
                sendJoin(mInfo.id);
                break;
            case R.id.btn_back:
                finish();
                break;
            case R.id.btn_view_resource:
                gotoResourceActivity(mInfo);
                break;
            default:
                break;

        }
        if(i != null){
            try{
                startActivityForResult(i, viewId);
            }catch(Exception e){//某些机器上启动不了摄像头拍照或录像
//                Toast.makeText(this, R.string.launch_camera_fail, Toast.LENGTH_LONG).show();
            }
        }
    }

    private void sendJoin(String activityId) {

        defaultRequestData.putString("id",activityId);
        app.doAction(ServiceManager.Constants.ACTION_JION_ACTIVITY,defaultRequestData,new ActionListener(this) {
            @Override
            public void onReceive(int action, Bundle data) {
                if(data != null && data.getString("result")!= null){
                    Log.i("SWall", TAG + " " + data.getString("result"));
                    Toast.makeText(TRAInfoActivity.this,"加入成功",Toast.LENGTH_SHORT).show();
                    gotoCurrentActivity(mInfo);
                }else{
                    Toast.makeText(TRAInfoActivity.this,"加入活动失败",Toast.LENGTH_SHORT).show();
                }
                dismissProgressDialog();
            }
        });
    }

    private void dismissProgressDialog() {

//        mJoiningDialog.dismiss();
    }


    private void showJoiningDialog() {
        /*
        if(mJoiningDialog != null && mJoiningDialog.isShowing() ){
            return;
        }
        mJoiningDialog = new ProgressDialog(this);
        mJoiningDialog.setTitle("正在加入活动");
        mJoiningDialog.setCancelable(false);
        mJoiningDialog.show();
        */
    }



    private void gotoResourceActivity(TRAInfo info) {
        Intent i = new Intent(this,TRAResourceListAcitivity.class);
        i.putExtra("result",info.toString());

        startActivity(i);
        finish();
    }
    private void gotoCurrentActivity(TRAInfo info) {
        Intent i = new Intent(this,CurrentTRAActivity.class);
        i.putExtra("result",info.toString());

        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP|Intent.FLAG_ACTIVITY_CLEAR_TASK);
        startActivity(i);
        finish();
    }

}