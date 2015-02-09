package com.swall.tra.network;

import com.android.volley.AuthFailureError;
import com.android.volley.NetworkResponse;
import com.android.volley.ParseError;
import com.android.volley.Response;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.JsonObjectRequest;
import org.apache.http.protocol.HTTP;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.UnsupportedEncodingException;
import java.util.Map;

/**
 * Created by pxz on 14-1-7.
 */
public class MyJsonObjectRequest extends JsonObjectRequest{
    public MyJsonObjectRequest(int method, String url, JSONObject params, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener) {
        super(method,url,params,listener,errorListener);
    }

    public MyJsonObjectRequest(String method, JSONObject params, Response.Listener<JSONObject> listener, Response.ErrorListener errorListener) {
        super(method, params, listener, errorListener);
    }

    @Override
    protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
        try {
            String jsonString =
                    new String(response.data, parseCharset(response.headers));
            return Response.success(new JSONObject(jsonString),
                    HttpHeaderParser.parseCacheHeaders(response));
        } catch (UnsupportedEncodingException e) {
            return Response.error(new ParseError(e));
        } catch (JSONException je) {
            return Response.error(new ParseError(je));
        }
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
    public Map<String, String> getHeaders() throws AuthFailureError {
        return ActionService.getRequestHeaders();
    }
}
