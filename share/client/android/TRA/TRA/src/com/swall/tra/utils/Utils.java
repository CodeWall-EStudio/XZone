package com.swall.tra.utils;

import android.os.Environment;

/**
 * Created by pxz on 14-1-8.
 */
public class Utils {
    public static String getExternalDir(){
        return Environment.getExternalStorageDirectory().getAbsolutePath()+"/";
    }

    public static boolean hasSDCard() {
        return android.os.Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState());
    }
}
