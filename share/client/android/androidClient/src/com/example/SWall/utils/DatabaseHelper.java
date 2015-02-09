package com.example.SWall.utils;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;
import com.example.SWall.model.AccountInfo;

import java.util.*;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 下午7:28
 */
public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String DATABASE_NAME       = "SWall";
    private static final int    DATABASE_VERSION    = 1;
    private static final String USER_TABLENAME      = "Users";
    private static final String USER_ID_COL         = "uid";
    private static final String USER_NAME_COL       = "uname";
    private static final String USER_QQ_TOKEN_COL   = "qq_token";
    private static final String USER_QQ_OPENID_COL  = "qq_openid";
    private static final String USER_QQ_EXPIRED_COL = "qq_expired";
    private static final String USER_PWD_COL        = "user_pwd";
    private static final String TAG = "DataBaseHelper";
    private Object synLocker = new Object();

    private static final String[] USER_COLUMS = {USER_ID_COL,USER_NAME_COL,USER_PWD_COL};

    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    /**
     * 更新用户信息
     * @param userName
     * @param userPassword
     */
    public void updateAccountInfo(String userName,String userPassword){
        synchronized (synLocker) {
            SQLiteDatabase db = getWritableDatabase();
            try {
                db.beginTransaction();

                ContentValues cv = new ContentValues();
                cv.put(USER_NAME_COL, userName);
                cv.put(USER_PWD_COL, userPassword);

                int updateRowNum = db.update(USER_TABLENAME, cv,  USER_NAME_COL + " = ?", new String[] { userName });
                if(updateRowNum == 0){//无法更新，表示未存在，插入新数据
                    long insertRowID = db.insert(USER_TABLENAME, null, cv);
                    Log.v(TAG, "updateAccountInfo insert rowID = "+insertRowID);
                }

                db.setTransactionSuccessful();

            } catch (Exception e) {
                Log.e(TAG, "updateAccountInfo ", e);
            } finally {
                db.endTransaction();
            }
            db.close();
        }
    }

    public List<AccountInfo> getAccountInfoList(){
        synchronized (synLocker) {
            SQLiteDatabase db = getReadableDatabase();
            Cursor cursor = db.query(USER_TABLENAME, USER_COLUMS, null, null, null, null, null);
            try {
                if (cursor.getCount() > 0) {
                    ArrayList<AccountInfo> accounts = new ArrayList<AccountInfo>();
                    cursor.moveToFirst();
                    do {
                        String userid = cursor.getString(0);
                        String userName = cursor.getString(1);
                        String userPassword = cursor.getString(2);
                        AccountInfo info = new AccountInfo(userid,userName,userPassword);
                        accounts.add(info);
                    } while (cursor.moveToNext());
                    return accounts;
                }
            } catch (Exception e) {
                Log.e(TAG, "getAccountInfoList", e);
            } finally {
                if (cursor != null) {
                    cursor.close();
                }
            }
            db.close();
        }
        return Collections.EMPTY_LIST;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL("CREATE TABLE " + USER_TABLENAME + " ("
                + USER_ID_COL + " INTEGER PRIMARY KEY,"
                + USER_NAME_COL + " TEXT,"
                + USER_QQ_TOKEN_COL + " TEXT,"
                + USER_QQ_OPENID_COL + " TEXT,"
                + USER_QQ_EXPIRED_COL + " INTEGER,"
                + USER_PWD_COL + " TEXT"               // 不使用QQ登录时有此项
                + ");");
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        Log.w(TAG, "Upgrading database from version " + oldVersion + " to "
                + newVersion + ", which will destroy all old data");
        db.execSQL("DROP TABLE IF EXISTS notes");
        onCreate(db);
    }
}