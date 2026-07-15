package com.snappy.app;

import android.webkit.WebView;

final class WebViewEvent {
    private WebViewEvent() {}

    static void dispatch(WebView webView, String name, String options) {
        webView.post(
                () ->
                        webView.evaluateJavascript(
                                "window.dispatchEvent(new CustomEvent('"
                                        + name
                                        + "'"
                                        + (options == null ? "" : ", " + options)
                                        + "))",
                                null));
    }
}
