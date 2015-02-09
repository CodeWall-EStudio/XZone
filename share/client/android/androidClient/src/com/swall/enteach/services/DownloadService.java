package com.swall.enteach.services;

import android.content.Context;
import android.os.Bundle;

/**
 * Created by pxz on 13-12-13.
 */
public class DownloadService extends ActionService {

    public DownloadService(Context context,ServiceManager manager){
        super(context, manager);
    }

    @Override
    public void doAction(int action, Bundle data, ActionListener callback) {

    }

    @Override
    public int[] getActionList() {
        return new int[0];
    }
}
