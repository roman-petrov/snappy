package com.snappy.app;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.net.Uri;
import android.util.Base64;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import androidx.core.content.FileProvider;
import androidx.core.view.RoundedCornerCompat;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class Bridge {
    private final MainActivity activity;
    private final WebView webView;
    private boolean keyboardOpen;

    public Bridge(MainActivity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
    }

    @JavascriptInterface
    public void setBarStyle(String theme) {
        onUi(
                () -> {
                    WindowInsetsControllerCompat controller =
                            WindowCompat.getInsetsController(
                                    activity.getWindow(), activity.getWindow().getDecorView());
                    boolean lightBars = "light".equals(theme);
                    controller.setAppearanceLightStatusBars(lightBars);
                    controller.setAppearanceLightNavigationBars(lightBars);
                });
    }

    @JavascriptInterface
    public float screenCornerRadius() {
        return ViewCompat.getRootWindowInsets(activity.getWindow().getDecorView())
                        .getRoundedCorner(RoundedCornerCompat.POSITION_TOP_LEFT)
                        .getRadius()
                / activity.getResources().getDisplayMetrics().density;
    }

    @JavascriptInterface
    public boolean isSystemDark() {
        int nightModeFlags =
                activity.getResources().getConfiguration().uiMode
                        & Configuration.UI_MODE_NIGHT_MASK;
        return nightModeFlags == Configuration.UI_MODE_NIGHT_YES;
    }

    @JavascriptInterface
    public void hapticImpact(int constant) {
        onUi(
                () -> {
                    View view = activity.getWindow().getDecorView();
                    view.performHapticFeedback(constant);
                });
    }

    @JavascriptInterface
    public void copyHtml(String html, String plain) {
        onUi(
                () -> {
                    ClipboardManager clipboard =
                            (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
                    clipboard.setPrimaryClip(ClipData.newHtmlText("html", plain, html));
                });
    }

    @JavascriptInterface
    public void copyImage(String base64, String name, String ext) {
        onUi(
                () -> {
                    Uri uri = cacheUri(base64, name, ext);
                    ClipboardManager clipboard =
                            (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
                    clipboard.setPrimaryClip(
                            ClipData.newUri(activity.getContentResolver(), "image", uri));
                });
    }

    @JavascriptInterface
    public void shareHtml(String html, String plain, String title) {
        onUi(
                () -> {
                    Intent intent = new Intent(Intent.ACTION_SEND);
                    intent.setType("text/html");
                    intent.putExtra(Intent.EXTRA_HTML_TEXT, html);
                    intent.putExtra(Intent.EXTRA_TEXT, plain);
                    intent.putExtra(Intent.EXTRA_SUBJECT, title);
                    activity.startActivity(Intent.createChooser(intent, title));
                });
    }

    @JavascriptInterface
    public void shareImage(String base64, String mime, String title, String ext) {
        onUi(
                () -> {
                    Uri uri = cacheUri(base64, "share", ext);
                    Intent intent = new Intent(Intent.ACTION_SEND);
                    intent.setType(mime);
                    intent.putExtra(Intent.EXTRA_STREAM, uri);
                    intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    activity.startActivity(Intent.createChooser(intent, title));
                });
    }

    public void systemThemeChanged() {
        WebViewEvent.dispatch(webView, "snappy:system-theme-changed", null);
    }

    public void keyboardChanged(boolean open) {
        if (keyboardOpen == open) {
            return;
        }
        keyboardOpen = open;
        WebViewEvent.dispatch(
                webView, "snappy:keyboard-changed", "{ detail: { open: " + open + " } }");
    }

    public void shakeDetected() {
        WebViewEvent.dispatch(webView, "snappy:shake", null);
    }

    private Uri cacheUri(String base64, String name, String ext) {
        File file = new File(activity.getCacheDir(), name + "." + ext);
        byte[] data = Base64.decode(base64, Base64.DEFAULT);
        try (FileOutputStream out = new FileOutputStream(file)) {
            out.write(data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return FileProvider.getUriForFile(
                activity, activity.getPackageName() + ".fileprovider", file);
    }

    private void onUi(Runnable action) {
        activity.runOnUiThread(action);
    }
}
