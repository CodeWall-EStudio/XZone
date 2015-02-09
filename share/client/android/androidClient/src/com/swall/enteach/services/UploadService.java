package com.swall.enteach.services;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import com.android.volley.*;
import com.android.volley.toolbox.JsonObjectRequest;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-13.
 */
public class UploadService extends ActionService {
    final String UPLOAD_URL = "http://localhost:8999/upload/";

    public UploadService(Context context,ServiceManager manager) {
        super(context, manager);
    }

    @Override
    public void doAction(int action, Bundle data, ActionListener callback) {
        switch (action){
            case ServiceManager.Constants.ACTION_UPLOAD_TEXT:
                uploadText(data,callback);
                break;
        }
    }

    private void uploadText(Bundle data, ActionListener callback) {
        RequestQueue rq = MyVolley.getRequestQueue();
        JsonObjectRequest jor = new JsonObjectRequest(
                Request.Method.POST,
                ServiceManager.Constants.getUpdatesUrl(data.getString("userName","xamn"),data),
                null,
                new Response.Listener<JSONObject>(){

                    @Override
                    public void onResponse(JSONObject response) {
                        Log.i("SWall", response.toString());
                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {

                    }
                }
        );

        rq.start();
    }

    @Override
    public int[] getActionList() {
        return new int[]{
                ServiceManager.Constants.ACTION_UPLOAD_PIC,
                ServiceManager.Constants.ACTION_UPLOAD_TEXT,
                ServiceManager.Constants.ACTION_UPLOAD_VIDEO
        };
    }


    private void doUpload(String postUrl,byte[] data){

    }
}
