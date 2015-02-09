package com.swall.enteach.utils;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import com.swall.enteach.services.ServiceManager;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.net.URL;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 下午1:07
 */
public class HttpUtils {

    private static final String TAG = "HttpUtils";
    private static final String DATA_URL_PREFIX = "http://codewall.com/user/login/";

    public static void doLogin(final String userName, final String password,final Handler dataHandler) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                URL url = null;
                Message msg = dataHandler.obtainMessage(ServiceManager.Constants.ACTION_LOGIN);
                Bundle data = new Bundle();
                data.putBoolean(ServiceManager.Constants.KEY_STATUS,false);
                msg.setData(data);

                HttpGet httpRequest = new HttpGet(DATA_URL_PREFIX+userName+"/"+password);
                HttpClient httpclient = new DefaultHttpClient();
                try {
                    HttpResponse httpResponse = httpclient.execute(httpRequest);
                    Log.i(TAG,"status:"+httpResponse.getStatusLine());
                    Log.i(TAG,"content:"+ EntityUtils.toString(httpResponse.getEntity()));
                    data.putBoolean(ServiceManager.Constants.KEY_STATUS, true);
                    // TODO other info
                } catch (IOException e) {
                    Log.e(TAG, "doLogin", e);
                }
                dataHandler.sendMessage(msg);
            }
        }).start();
    }
}
