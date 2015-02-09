package com.swall.enteach.services;

import android.app.ActivityManager;
import android.content.Context;
import android.graphics.Bitmap;
import android.util.LruCache;
import com.android.volley.RequestQueue;
import com.android.volley.toolbox.ImageLoader;
import com.android.volley.toolbox.Volley;

/**
 * Created by pxz on 13-12-18.
 */
public class MyVolley {
    private static RequestQueue sRequestQueue;
    private static ImageLoader sImageLoader;

    static void init(Context context){
        sRequestQueue = Volley.newRequestQueue(context);

        // 使用 1/8 的可用内存为缓存
        int memClass = ((ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE)).getMemoryClass();
        int cacheSize = memClass * 1024 * 1024 / 8;
        sImageLoader = new ImageLoader(sRequestQueue, new BitmapLruCache(cacheSize));
    }

    public static RequestQueue getRequestQueue(){
        if(sRequestQueue == null){
            throw new IllegalStateException("RequestQueue not initialed");
        }
        return sRequestQueue;
    }

    public static ImageLoader getImageLoader() {
        if( sImageLoader == null ){
            throw new IllegalStateException("sImageLoader not initialed");
        }
        return sImageLoader;
    }

    private static class BitmapLruCache extends LruCache<String,Bitmap> implements ImageLoader.ImageCache {
        public BitmapLruCache(int maxSize) {
            super(maxSize);
        }

        @Override
        protected int sizeOf(String key,Bitmap value){
            return value.getRowBytes() * value.getHeight();
        }

        @Override
        public Bitmap getBitmap(String url) {
            return get(url);
        }

        @Override
        public void putBitmap(String url, Bitmap bitmap) {
            put(url,bitmap);
        }
    }
}