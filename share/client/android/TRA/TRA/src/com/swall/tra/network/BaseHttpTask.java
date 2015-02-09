package com.swall.tra.network;

import android.os.AsyncTask;
import android.os.Bundle;
import com.swall.tra.BaseActivity;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.params.HttpParams;

import java.lang.ref.WeakReference;

/**
 * Created by ippan on 13-12-24.
 */
public abstract class  BaseHttpTask extends AsyncTask<String,Void,Bundle> {
    protected WeakReference<BaseActivity> activityRef;


    public BaseHttpTask(BaseActivity activity) {
        super();
        activityRef = new WeakReference<BaseActivity>(activity);
    }

    public void doNetworkRequest(){
        HttpClient httpClient = new DefaultHttpClient();
        HttpParams params = httpClient.getParams();

    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
    }

    @Override
    protected void onPostExecute(Bundle bundle) {
        super.onPostExecute(bundle);
    }

    @Override
    protected void onProgressUpdate(Void... values) {
        super.onProgressUpdate(values);
    }

    @Override
    protected void onCancelled(Bundle bundle) {
        super.onCancelled(bundle);
    }

    @Override
    protected void onCancelled() {
        super.onCancelled();
    }
}
