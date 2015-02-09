package com.swall.enteach.services;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import com.android.volley.*;
import com.android.volley.toolbox.JsonObjectRequest;
import org.apache.http.protocol.HTTP;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

import static com.swall.enteach.services.ServiceManager.Constants;

/**
 * Created by pxz on 13-12-19.
 */
public class DataService extends ActionService{
    public DataService(Context context, ServiceManager serviceManager) {
        super(context,serviceManager);
    }

    @Override
    public void doAction(final int action, final Bundle data, final ActionListener callback) {
        switch (action){
            case Constants.ACTION_GET_UPDATES:
                break;
            case Constants.ACTION_GET_AVAILABLE_ACTIVITIES:
                getActivities(action, data, callback, true);
                break;
            case  Constants.ACTION_GET_CURRENT_ACTIVITY_INFO:
                getCurrentActivityInfo(action,data,callback);
                break;
            case Constants.ACTION_GET_EXPIRED_ACTIVITIES:
                getActivities(action, data, callback, false);
                break;
            default:
                super.doAction(action,data,callback);
                break;
        }
    }


    JsonObjectRequest availableActivityRequest;
    private void getActivities(final int action, final Bundle data, final ActionListener callback, final boolean active) {
        if(availableActivityRequest != null && availableActivityRequest.hasHadResponseDelivered()){
            // TODO
            //throw new Error("deal with me...");
        }
        RequestQueue rq = MyVolley.getRequestQueue();
        availableActivityRequest  = new JsonObjectRequest(
                Constants.getActivitiesListUrl(data.getString("userName"),active,data.getInt("index",0)),null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        if(!response.has("r") ||  !response.has("c")){
                            notifyListener(action,null);
                            return;
                        }
                        Bundle result = new Bundle();
                        result.putString("result",response.toString());
                        notifyListener(action,result,callback);

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO 分别处理网络错误
                        notifyListener(Constants.ACTION_GET_AVAILABLE_ACTIVITIES,null,callback);
                    }
                }
        ){
            @Override
            protected Response<JSONObject> parseNetworkResponse(
                    NetworkResponse response) {
                try {
                    String str = new String(response.data,"utf8");

                    Log.i("SWall",new String(response.data,"utf8"));
                } catch (UnsupportedEncodingException e) {
                    e.printStackTrace();
                }
                try {
                    String type = response.headers.get(HTTP.CONTENT_TYPE);
                    if (type == null) {
                        Log.d("SWall", "content type was null");
                        type = "charset=UTF8";
                        response.headers.put(HTTP.CONTENT_TYPE, type);
                        response.headers.put(HTTP.CONTENT_ENCODING,"UTF8");
                        response.headers.put(HTTP.TRANSFER_ENCODING,"UTF8");
                    } else if (!type.contains("UTF-8")) {
                        Log.d("SWall", "content type had UTF-8 missing");
                        type += ";" + "charset=UTF-8";
                        response.headers.put(HTTP.CONTENT_TYPE, type);
                    }
                } catch (Exception e) {
                    //print stacktrace e.g.
                }
                return super.parseNetworkResponse(response);
            }
        };
        rq.add(availableActivityRequest);
        rq.start();
    }

    private void getCurrentActivityInfo(int action, Bundle data, ActionListener callback) {

    }


    @Override
    public int[] getActionList() {
        return new int[]{
                Constants.ACTION_GET_UPDATES,
                Constants.ACTION_GET_CURRENT_ACTIVITY_INFO,
                Constants.ACTION_GET_AVAILABLE_ACTIVITIES,
                Constants.ACTION_GET_EXPIRED_ACTIVITIES
        };
    }
}
