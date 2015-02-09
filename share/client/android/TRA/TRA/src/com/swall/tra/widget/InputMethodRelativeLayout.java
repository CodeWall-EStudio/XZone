package com.swall.tra.widget;

import android.app.Activity;
import android.content.Context;
import android.util.AttributeSet;
import android.view.Display;
import android.widget.RelativeLayout;

import java.lang.ref.WeakReference;

/**
 * Created by pxz on 13-12-14.
 */
public class InputMethodRelativeLayout extends RelativeLayout {

    protected WeakReference<onSizeChangedListenner> mOnSizeChangedListennerRef;
    private int widthMeasureSpec;
    private int heightMeasureSpec;

    private int screenWidth;
    private int screenHeight;

    public InputMethodRelativeLayout(Context context, AttributeSet attrs) {
        super(context, attrs);
        Display display = ((Activity) context).getWindowManager().getDefaultDisplay();
        screenWidth = display.getWidth();
        screenHeight = display.getHeight();
    }

    public InputMethodRelativeLayout(Context context, AttributeSet attrs,
                                     int defStyle) {
        super(context, attrs, defStyle);
    }

    private boolean isOpen = false;

    @Override
    public void onSizeChanged(int w, int h, int oldw, int oldh) {
        if(mOnSizeChangedListennerRef == null) return;
        onSizeChangedListenner onSizeChangedListenner = mOnSizeChangedListennerRef.get();
        if (onSizeChangedListenner != null) {
            //只强制竖屏
            if(w == oldw && oldw != 0 && oldh != 0){
                if (h < oldh && Math.abs(h-oldh) > 50) {
                    isOpen = true;
                } else if (h > oldh && Math.abs(h-oldh) > 50) {
                    isOpen = false;
                } else {
                    return;
                }
                onSizeChangedListenner.onSizeChange(isOpen, oldh, h);
                measure(widthMeasureSpec-w+getWidth(), heightMeasureSpec-h+getHeight());
            }
        }
    }

    @Override
    public void onMeasure(int widthMeasureSpec, int heightMeasureSpec){
        this.widthMeasureSpec = widthMeasureSpec;
        this.heightMeasureSpec = heightMeasureSpec;
        super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    }

    public interface onSizeChangedListenner{
        void onSizeChange(boolean isOpen, int preH, int curH);
    }

    public void setOnSizeChangedListenner(onSizeChangedListenner l){
        this.mOnSizeChangedListennerRef = new WeakReference<onSizeChangedListenner>(l);
    }

}