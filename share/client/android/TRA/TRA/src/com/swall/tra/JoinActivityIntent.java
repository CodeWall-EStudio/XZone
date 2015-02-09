package com.swall.tra;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import com.swall.tra.network.ActionListener;

import static com.swall.tra.network.ServiceManager.Constants;

/**
 * Created by pxz on 13-12-25.
 */
public class JoinActivityIntent extends BaseFragmentActivity {
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_join);

        Intent intent = getIntent();
        String activityId = intent.getStringExtra("id");
        if(activityId == null){
            finish();
            return;
        }
        defaultRequestData.putString("id",activityId);
        app.doAction(Constants.ACTION_JION_ACTIVITY,defaultRequestData,new ActionListener(this) {
            @Override
            public void onReceive(int action, Bundle data) {
                if(data != null && data.getString("result")!= null){
                    Log.i("SWall", TAG + " " + data.getString("result"));
                    Toast.makeText(JoinActivityIntent.this,"加入成功",Toast.LENGTH_SHORT).show();
                    setResult(RESULT_OK);
                    finish();
                }else{
                    Toast.makeText(JoinActivityIntent.this,"加入活动失败",Toast.LENGTH_SHORT).show();
                    finish();
                }
            }
        });

    }
}