package com.example.SWall.activity;

import android.view.LayoutInflater;
import android.view.View;
import com.example.SWall.R;

/**
 * Author: iptton
 * Date: 13-12-8
 * Time: 上午2:39
 */
public class TimelineFrame extends TabFrame {
    @Override
    public View onCreateView(LayoutInflater inflater) {
        mView = inflater.inflate(R.layout.timeline,null);
        return mView;
    }
}
