package com.swall.enteach.utils;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

/**
 * Created by pxz on 13-12-17.
 */
public class ActivitiesDBHelper extends SQLiteOpenHelper {
    private static final String TABLENAME = "activity_table";
    private static final String ACTIVITY_ID = "id";
    private static final String ACTIVITY_NAME = "name";
    private static final String ACTIVITY_SUB_NAME = "subname";
    private static final String ACTIVITY_DATETIME = "data_time";
    private static final String[] COLUMS = {
            ACTIVITY_ID,
            ACTIVITY_NAME,
            ACTIVITY_SUB_NAME,
            ACTIVITY_DATETIME
    };

    public ActivitiesDBHelper(Context context) {
        super(context,TABLENAME,null,1);
    }

    public Cursor getAllActivities(){
        SQLiteDatabase db = getReadableDatabase();
        Cursor cursor = db.query(TABLENAME, COLUMS, null, null, null, null, null);
        db.close();
        return cursor;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {

        db.execSQL("CREATE TABLE " + TABLENAME + " ("
                + ACTIVITY_ID + " INTEGER PRIMARY KEY,"
                + ACTIVITY_NAME + " TEXT,"
                + ACTIVITY_SUB_NAME + " TEXT,"
                + ACTIVITY_DATETIME + " TEXT"             // 不使用QQ登录时有此项
                + ");");

        for(int i=0;i<100;++i){
            ContentValues cv = new ContentValues();
            cv.put(ACTIVITY_NAME,"张老实的公开课"+i);
            cv.put(ACTIVITY_SUB_NAME,"初一二班");
            cv.put(ACTIVITY_DATETIME,"2014年2月30号");
            db.insert(TABLENAME,null,cv);
        }
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {

    }
}
