package com.swall.tra.utils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;

/**
 * Created by pxz on 13-12-22.
 */
public class JSONUtils {
    public static String getString(JSONObject object,String key,String defaultValue){
        try{
            return object.getString(key);
        }catch (Exception e){
            return defaultValue;
        }
    }
    public static int getInt(JSONObject object,String key, int defaultValue){
        try{
            return object.getInt(key);
        }catch (Exception e){
            return defaultValue;
        }
    }
    public static boolean getBoolean(JSONObject object,String key,boolean defaultValue){
        try{
            return object.getBoolean(key);
        }catch (Exception e){
            return defaultValue;
        }
    }

    public static JSONObject getJSONObject(JSONObject object, String key, JSONObject defaultValue) {
        try{
            return object.getJSONObject(key);
        }catch (Exception e){
            return defaultValue;
        }
    }

    public static JSONArray getJSONArray(JSONObject object, String key, JSONArray defaultValue) {
        try{
            return object.getJSONArray(key);
        }catch (Exception e){
            return defaultValue;
        }
    }

    public static ArrayList<String> JSONStringArrayToStringArray(JSONArray array) {
        if(array == null || array.length() == 0){
            return new ArrayList<String>();
        }
        String[] tmp = new String[array.length()];
        ArrayList<String> list = new ArrayList<String>();
        for(int i=0;i<array.length();++i){
            try {
                String str = array.getString(i);
                list.add(str);
            } catch (JSONException e) {
                // do nothing..
                // TODO report
            }
        }
        return list;
    }

    public static JSONArray arrayGetJSONArray(JSONArray array,int index){
        try{
            return array.getJSONArray(index);
        }catch (Exception e){
            // TODO report
            e.printStackTrace();
        }
        return null;
    }

    public static JSONObject arrayGetJSONObject(JSONArray array, int index) {
        try{
            return array.getJSONObject(index);
        }catch (Exception e){
            // TODO report
            e.printStackTrace();
        }
        return null;
    }

    public static long getLong(JSONObject object, String key, long defaultValue) {
        try{
            return object.getLong(key);
        }catch (Exception e){
            return defaultValue;
        }
    }
}
