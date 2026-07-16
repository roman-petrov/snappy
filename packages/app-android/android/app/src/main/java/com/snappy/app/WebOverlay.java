package com.snappy.app;

import android.content.Context;
import android.graphics.Bitmap;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import java.util.function.Consumer;

final class WebOverlay {
    private final String appUrl;
    private final ViewGroup container;
    private final Consumer<String> onReturnToApp;
    private final WebChrome webChrome;
    private boolean historyTrimmed;
    private boolean returning;
    private FrameLayout shell;
    private WebView guest;

    WebOverlay(
            ViewGroup container,
            String appUrl,
            WebChrome webChrome,
            Consumer<String> onReturnToApp) {
        this.container = container;
        this.appUrl = appUrl;
        this.webChrome = webChrome;
        this.onReturnToApp = onReturnToApp;
    }

    boolean isOpen() {
        return shell != null;
    }

    void open(String url) {
        if (shell == null) {
            Context context = container.getContext();
            shell = new FrameLayout(context);
            shell.setLayoutParams(
                    new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT));
            shell.setBackgroundColor(ContextCompat.getColor(context, R.color.chrome));
            shell.setClickable(true);
            ViewCompat.setOnApplyWindowInsetsListener(shell, WebOverlay::applyInsets);

            guest = new WebView(context);
            WebSettings settings = guest.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            guest.setWebViewClient(
                    new WebViewClient() {
                        @Override
                        public boolean shouldOverrideUrlLoading(
                                WebView view, WebResourceRequest request) {
                            if (!request.isForMainFrame()) {
                                return false;
                            }
                            return handleUrl(view.getContext(), request.getUrl().toString());
                        }

                        @Override
                        public void onPageStarted(WebView view, String url, Bitmap favicon) {
                            if (AppLink.inApp(url, appUrl)) {
                                returnToApp(url);
                            }
                        }

                        @Override
                        public void onPageFinished(WebView view, String url) {
                            if (historyTrimmed || url == null || url.equals("about:blank")) {
                                return;
                            }
                            view.clearHistory();
                            historyTrimmed = true;
                        }
                    });
            shell.addView(
                    guest,
                    new FrameLayout.LayoutParams(
                            ViewGroup.LayoutParams.MATCH_PARENT,
                            ViewGroup.LayoutParams.MATCH_PARENT));
            container.addView(shell);
            ViewCompat.requestApplyInsets(shell);
            webChrome.setExternal(true);
        }
        returning = false;
        historyTrimmed = false;
        if (guest != null) {
            guest.setVisibility(View.VISIBLE);
            guest.loadUrl(url);
        }
    }

    boolean back() {
        if (shell == null) {
            return false;
        }
        if (guest != null && guest.getVisibility() == View.VISIBLE && guest.canGoBack()) {
            guest.goBack();
            return true;
        }
        close();
        return true;
    }

    void close() {
        if (shell == null) {
            return;
        }
        container.removeView(shell);
        if (guest != null) {
            guest.destroy();
            guest = null;
        }
        shell = null;
        historyTrimmed = false;
        returning = false;
        webChrome.setExternal(false);
    }

    private boolean handleUrl(Context context, String url) {
        if (AppLink.openOutside(context, url)) {
            return true;
        }
        if (AppLink.inApp(url, appUrl)) {
            returnToApp(url);
            return true;
        }
        return false;
    }

    private void returnToApp(String url) {
        if (shell == null || returning) {
            return;
        }
        returning = true;
        if (guest != null) {
            guest.setVisibility(View.GONE);
            guest.stopLoading();
            guest.loadUrl("about:blank");
        }
        onReturnToApp.accept(url);
    }

    private static WindowInsetsCompat applyInsets(View view, WindowInsetsCompat windowInsets) {
        Insets ime = windowInsets.getInsets(WindowInsetsCompat.Type.ime());
        Insets bars = windowInsets.getInsets(WindowInsetsCompat.Type.systemBars());
        view.setPadding(bars.left, bars.top, bars.right, Math.max(bars.bottom, ime.bottom));
        return WindowInsetsCompat.CONSUMED;
    }
}
