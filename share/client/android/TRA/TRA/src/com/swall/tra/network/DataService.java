package com.swall.tra.network;

import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import com.android.volley.*;
import com.android.volley.toolbox.JsonObjectRequest;
import org.apache.http.protocol.HTTP;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;

import static com.swall.tra.network.ServiceManager.Constants;

/**
 * Created by pxz on 13-12-19.
 */
public class DataService extends ActionService{
    public DataService(Context context, ServiceManager serviceManager) {
        super(context,serviceManager);
    }

    @Override
    public void doAction(final int action, final Bundle data, final ActionListener listener) {
        switch (action){
            case Constants.ACTION_GET_UPDATES:
                break;
            case Constants.ACTION_GET_AVAILABLE_ACTIVITIES:
                getActivities(action, data, listener, true);
                break;
            case  Constants.ACTION_GET_CURRENT_ACTIVITY_INFO:
                getCurrentActivityInfo(action,data,listener);
                break;
            case Constants.ACTION_GET_EXPIRED_ACTIVITIES:
                getActivities(action, data, listener, false);
                break;
            case Constants.ACTION_JION_ACTIVITY:
                joinActivity(action,data,listener);
                break;
            case Constants.ACTION_QUIT_ACTIVITY:
                quitActivity(action,data,listener);
                break;
            default:
                super.doAction(action,data,listener);
                break;
        }
    }

    private void quitActivity(final int action,final  Bundle data, final ActionListener listener) {
        RequestQueue rq = MyVolley.getRequestQueue();

        MyJsonObjectRequest request  = new MyJsonObjectRequest(
                Request.Method.DELETE,
                Constants.getQuitUrl(data.getString(Constants.KEY_USER_NAME), data.getString("id")),null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        if(!response.has("c")){
                            notifyListener(action,null);
                            return;
                        }
                        Bundle result = new Bundle();
                        result.putString("result",response.toString());
                        notifyListener(action,result,listener);

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO 分别处理网络错误
                        notifyListener(action,null,listener);
                    }
                }
        );
        rq.add(request);
        rq.start();
    }

    private void joinActivity(final int action,final Bundle data,final ActionListener listener) {
        RequestQueue rq = MyVolley.getRequestQueue();

        MyJsonObjectRequest request  = new MyJsonObjectRequest(
                Request.Method.POST,
                Constants.getJoinUrl(data.getString(Constants.KEY_USER_NAME), data.getString("id")),null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        if(!response.has("c")){
                            notifyListener(action,null);
                            return;
                        }
                        Bundle result = new Bundle();
                        result.putString("result",response.toString());
                        notifyListener(action,result,listener);

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO 分别处理网络错误
                        notifyListener(action,null,listener);
                    }
                }
        );
        rq.add(request);
        rq.start();
    }


    MyJsonObjectRequest availableActivityRequest;
    private void getActivities(final int action, final Bundle data, final ActionListener listener, final boolean active) {
        if(availableActivityRequest != null && availableActivityRequest.hasHadResponseDelivered()){
            // TODO
            //throw new Error("deal with me...");
        }
        RequestQueue rq = MyVolley.getRequestQueue();
        availableActivityRequest  = new MyJsonObjectRequest(
                Constants.getActivitiesListUrl(data.getString(Constants.KEY_USER_NAME),active,data.getInt("index",0),false),null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        if(!response.has("r") ||  !response.has("c")){
                            notifyListener(action,null);
                            return;
                        }
                        Bundle result = new Bundle();
                        result.putString("result",response.toString());
                        notifyListener(action,result,listener);

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO 分别处理网络错误
                        notifyListener(action,null,listener);
                    }
                }
        );
        rq.add(availableActivityRequest);
        rq.start();
    }

    private void getCurrentActivityInfo(final int action, final Bundle data, final ActionListener listener) {
        RequestQueue rq = MyVolley.getRequestQueue();
        MyJsonObjectRequest request  = new MyJsonObjectRequest(
                Constants.getActivitiesListUrl(data.getString(Constants.KEY_USER_NAME),true,data.getInt("index",0),true),null,
                new Response.Listener<JSONObject>() {
                    @Override
                    public void onResponse(JSONObject response) {
                        if(!response.has("r") ||  !response.has("c")){
                            notifyListener(action,null);
                            return;
                        }
                        Bundle result = new Bundle();
                        result.putString("result",response.toString());
                        notifyListener(action,result,listener);

                    }
                },
                new Response.ErrorListener() {
                    @Override
                    public void onErrorResponse(VolleyError error) {
                        // TODO 分别处理网络错误
                        notifyListener(action,null,listener);
                    }
                }
        );
        rq.add(request);
        rq.start();
    }


    @Override
    public int[] getActionList() {
        return new int[]{
                Constants.ACTION_GET_UPDATES,
                Constants.ACTION_GET_CURRENT_ACTIVITY_INFO,
                Constants.ACTION_GET_AVAILABLE_ACTIVITIES,
                Constants.ACTION_GET_EXPIRED_ACTIVITIES,
                Constants.ACTION_JION_ACTIVITY,
                Constants.ACTION_QUIT_ACTIVITY
        };
    }
}
