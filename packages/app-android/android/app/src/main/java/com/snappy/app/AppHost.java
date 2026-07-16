package com.snappy.app;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.NetworkRequest;
import android.view.View;
import android.view.ViewGroup;
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
    private final WebOverlay overlay;
    private final WebView webView;
    private boolean webReady;
    private ConnectivityManager.NetworkCallback networkCallback;

    AppHost(
            Context context,
            ViewGroup container,
            WebView webView,
            View splash,
            ErrorScreen errorScreen,
            String appUrl,
            WebChrome webChrome,
            Bridge bridge) {
        this.webView = webView;
        this.splash = splash;
        this.errorScreen = errorScreen;
        this.appUrl = appUrl;
        connectivity = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        overlay = new WebOverlay(container, appUrl, webChrome, bridge::externalReturned);
        bridge.setExternalReady(() -> webView.postOnAnimation(overlay::close));
    }

    void bind(String link) {
        webView.setWebViewClient(
                new WebViewClient() {
                    @Override
                    public boolean shouldOverrideUrlLoading(
                            WebView view, WebResourceRequest request) {
                        if (!request.isForMainFrame()) {
                            return false;
                        }
                        String url = request.getUrl().toString();
                        if (AppLink.openOutside(view.getContext(), url)) {
                            return true;
                        }
                        if (AppLink.http(url) && !AppLink.inApp(url, appUrl)) {
                            overlay.open(url);
                            return true;
                        }
                        return false;
                    }

                    @Override
                    public void onPageFinished(WebView view, String url) {
                        if (AppLink.inApp(url, appUrl) && !errorScreen.visible()) {
                            webReady = true;
                        }
                        if (!errorScreen.visible()) {
                            splash.setVisibility(View.GONE);
                        }
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
            load(AppLink.start(link, appUrl));
        } else {
            showStartupError(true);
        }
    }

    void open(String link) {
        if (AppLink.trusted(link, appUrl)) {
            overlay.close();
            webView.loadUrl(link);
        }
    }

    void destroy() {
        overlay.close();
        if (networkCallback != null) {
            connectivity.unregisterNetworkCallback(networkCallback);
            networkCallback = null;
        }
    }

    boolean errorVisible() {
        return errorScreen.visible();
    }

    boolean back() {
        if (overlay.isOpen()) {
            return overlay.back();
        }
        if (!webView.canGoBack()) {
            return false;
        }
        webView.goBack();
        return true;
    }

    private void loadMain() {
        load(appUrl);
    }

    private void load(String url) {
        webReady = false;
        errorScreen.hide();
        splash.setVisibility(View.VISIBLE);
        webView.loadUrl(url);
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
