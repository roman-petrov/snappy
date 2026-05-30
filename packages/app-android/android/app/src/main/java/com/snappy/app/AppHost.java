package com.snappy.app;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.net.http.SslError;
import android.view.View;
import android.webkit.SslErrorHandler;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;

final class AppHost {
    private final String appUrl;
    private final ConnectivityManager connectivity;
    private final ErrorScreen errorScreen;
    private final View splash;
    private final WebView webView;
    private boolean webReady;
    private ConnectivityManager.NetworkCallback networkCallback;

    AppHost(Context context, WebView webView, View splash, ErrorScreen errorScreen, String appUrl) {
        this.webView = webView;
        this.splash = splash;
        this.errorScreen = errorScreen;
        this.appUrl = appUrl;
        connectivity = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
    }

    void bind() {
        webView.setWebViewClient(
                new WebViewClient() {
                    @Override
                    public void onPageFinished(WebView view, String url) {
                        if (isAppUrl(url) && !errorScreen.visible()) {
                            webReady = true;
                        }
                        if (!errorScreen.visible()) {
                            splash.setVisibility(View.GONE);
                        }
                    }

                    // ! Remove this after we fix SSL certificate errors on on server!
                    @Override
                    public void onReceivedSslError(
                            WebView view, SslErrorHandler handler, SslError error) {
                        handler.proceed();
                    }

                    @Override
                    public void onReceivedError(
                            WebView view, WebResourceRequest request, WebResourceError error) {
                        onStartupLoadFailed(request);
                    }

                    @Override
                    public void onReceivedHttpError(
                            WebView view,
                            WebResourceRequest request,
                            WebResourceResponse errorResponse) {
                        if (errorResponse.getStatusCode() < 500) {
                            return;
                        }
                        onStartupLoadFailed(request);
                    }
                });

        errorScreen.setOnRetry(
                () -> {
                    if (networkAvailable()) {
                        loadMain();
                    } else {
                        showStartupError(true);
                    }
                });

        networkCallback =
                new ConnectivityManager.NetworkCallback() {
                    @Override
                    public void onAvailable(android.net.Network network) {
                        webView.post(
                                () -> {
                                    if (errorScreen.visible()) {
                                        loadMain();
                                    }
                                });
                    }

                    @Override
                    public void onLost(android.net.Network network) {
                        webView.post(() -> errorScreen.show(true));
                    }
                };
        connectivity.registerNetworkCallback(
                new NetworkRequest.Builder()
                        .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                        .build(),
                networkCallback);

        if (networkAvailable()) {
            loadMain();
        } else {
            showStartupError(true);
        }
    }

    void destroy() {
        if (networkCallback != null) {
            connectivity.unregisterNetworkCallback(networkCallback);
            networkCallback = null;
        }
    }

    boolean errorVisible() {
        return errorScreen.visible();
    }

    private void loadMain() {
        webReady = false;
        errorScreen.hide();
        splash.setVisibility(View.VISIBLE);
        webView.loadUrl(appUrl);
    }

    private boolean isAppUrl(String url) {
        return url != null && url.startsWith(appUrl);
    }

    private boolean networkAvailable() {
        android.net.Network network = connectivity.getActiveNetwork();
        if (network == null) {
            return false;
        }
        NetworkCapabilities capabilities = connectivity.getNetworkCapabilities(network);
        return capabilities != null
                && capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET);
    }

    private void onStartupLoadFailed(WebResourceRequest request) {
        if (!request.isForMainFrame() || webReady) {
            return;
        }
        showStartupError(!networkAvailable());
    }

    private void showStartupError(boolean network) {
        if (webReady) {
            return;
        }
        errorScreen.show(network);
    }
}
