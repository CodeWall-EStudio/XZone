package com.swall.tra.utils;

import android.graphics.Bitmap;
import com.android.volley.*;

import java.io.*;
import java.nio.charset.Charset;
import java.util.Map;

import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.StringRequest;
import com.swall.tra.network.ActionService;
import org.apache.http.HttpEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.ContentBody;
import org.apache.http.entity.mime.content.FileBody;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.protocol.HTTP;
import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by pxz on 13-12-25.
 */
public class NetworkUtils {
    public static class StringRequestWithParams extends StringRequest{

        private Map<String,String> params;
        public StringRequestWithParams(int method, String url,Map<String,String> params, Response.Listener<String> listener, Response.ErrorListener errorListener) {
            super(method, url, listener, errorListener);
            this.params = params;
        }

        public StringRequestWithParams(String url, Map<String,String> params, Response.Listener<String> listener, Response.ErrorListener errorListener) {
            super(url, listener, errorListener);
            this.params = params;
        }


        @Override
        protected Response<String> parseNetworkResponse(NetworkResponse response) {
            String parsed;
            try {
                parsed = new String(response.data, parseCharset(response.headers));
            } catch (UnsupportedEncodingException e) {
                parsed = new String(response.data);
            }
            return Response.success(parsed, HttpHeaderParser.parseCacheHeaders(response));
        }

        // 从HttpParams.parseCharset复制而来，只修改默认值为UTF8
        private static String parseCharset(Map<String, String> headers) {
            String contentType = headers.get(HTTP.CONTENT_TYPE);
            if (contentType != null) {
                String[] params = contentType.split(";");
                for (int i = 1; i < params.length; i++) {
                    String[] pair = params[i].trim().split("=");
                    if (pair.length == 2) {
                        if (pair[0].equals("charset")) {
                            return pair[1];
                        }
                    }
                }
            }

            return HTTP.UTF_8;
        }

        @Override
        protected Map<String, String> getParams() throws AuthFailureError {
            return params;
        }
    }

    public static class MultipartRequest extends Request<String> {

        private HttpEntity mEntity;
        private static final String FILE_PART_NAME = "file";
        private static final String STRING_PART_NAME = "text";

        private final Response.Listener<String> mListener;

        public MultipartRequest(String url,String encodeKey,byte[] data, File file,ContentType contentType,Response.Listener<String> listener, Response.ErrorListener errorListener){
            super(Method.POST, url, errorListener);
            mListener = listener;

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
            String fileName = System.currentTimeMillis()+"x";
            if(contentType.getMimeType().indexOf("3gp")!=-1){
                fileName += ".3gp";
            }else{
                fileName += ".jpeg";
            }
            builder.addTextBody("media", "1");
            builder.addTextBody("name",fileName);
            builder.addTextBody("skey",""+encodeKey);
//            builder.addTextBody("file",fileName);
//            builder.setCharset(Charset.forName("UTF-8"));
            if(file != null && file.exists()){
                builder.addBinaryBody("file",file, ContentType.create("image/jpeg"),fileName);
            }else{
                builder.addBinaryBody("file",data, contentType,fileName);
            }
            builder.setBoundary("----WebKitFormBoundaryOZP8ZyAfN79iuKUB--");
            mEntity = builder.build();

            setRetryPolicy(new RetryPolicy() {
                @Override
                public int getCurrentTimeout() {
                    return 100000;
                }

                @Override
                public int getCurrentRetryCount() {
                    return 0;
                }

                @Override
                public void retry(VolleyError error) throws VolleyError {

                }
            });
        }
        public MultipartRequest(String url,String encodeKey,File file,ContentType contentType,Response.Listener<String> listener, Response.ErrorListener errorListener){
            super(Method.POST, url, errorListener);
            mListener = listener;

            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            String fileName = System.currentTimeMillis()+"x";
            if(contentType.getMimeType().indexOf("3gp")!=-1){
                fileName += ".3gp";
            }else{
                fileName += ".jpg";
            }
            builder.addTextBody("media", "1");
            builder.addTextBody("name","noname");
            builder.addTextBody("encodeKey",encodeKey);
            builder.addTextBody("file", fileName);
//            builder.setCharset(Charset.forName("UTF-8"));
            builder.addBinaryBody("fileUpload",file, contentType,fileName);
            builder.setBoundary("------WebKitFormBoundarymilpfzFmBW97xGu4--");
            mEntity = builder.build();

        } 
/*
        public MultipartRequest(String url, Response.ErrorListener errorListener, Response.Listener<String> listener, File file, String stringPart)
        {
            super(Method.POST, url, errorListener);

            mListener = listener;
            MultipartEntityBuilder builder = MultipartEntityBuilder.create();
            builder.addBinaryBody(FILE_PART_NAME,file);

            mEntity = builder.build();
        }
*/

        @Override
        public String getBodyContentType()
        {
            return mEntity.getContentType().getValue();
        }

        @Override
        public byte[] getBody() throws AuthFailureError
        {
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            try
            {
                mEntity.writeTo(bos);
            }
            catch (IOException e)
            {
                VolleyLog.e("IOException writing to ByteArrayOutputStream");
            }
            return bos.toByteArray();
        }

        @Override
        protected Response<String> parseNetworkResponse(NetworkResponse response)
        {
            try {
                String string =
                        new String(response.data, HttpHeaderParser.parseCharset(response.headers));
                return Response.success(string,
                        HttpHeaderParser.parseCacheHeaders(response));
            } catch (UnsupportedEncodingException e) {
                return Response.error(new ParseError(e));
            }
        }

        @Override
        protected void deliverResponse(String response)
        {
            mListener.onResponse(response);
        }

        @Override
        public Map<String, String> getHeaders() throws AuthFailureError {
            return ActionService.getRequestHeaders();
        }
    }

    public static byte[] bitmap2Bytes(Bitmap bm){
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG, 100, baos);
        return baos.toByteArray();
    }
}
