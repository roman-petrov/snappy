package com.snappy.app;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.util.Base64;
import android.view.View;
import android.webkit.JavascriptInterface;
import androidx.core.content.FileProvider;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

public class Bridge {
    private final MainActivity activity;

    public Bridge(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void setBarStyle(String theme) {
        onUi(() -> {
            WindowInsetsControllerCompat controller = WindowCompat.getInsetsController(
                activity.getWindow(),
                activity.getWindow().getDecorView()
            );
            boolean lightBars = "light".equals(theme);
            controller.setAppearanceLightStatusBars(lightBars);
            controller.setAppearanceLightNavigationBars(lightBars);
        });
    }

    @JavascriptInterface
    public void hapticImpact(int constant) {
        onUi(() -> {
            View view = activity.getWindow().getDecorView();
            view.performHapticFeedback(constant);
        });
    }

    @JavascriptInterface
    public void copyText(String text) {
        onUi(() -> clipboard().setPrimaryClip(ClipData.newPlainText("text", text)));
    }

    @JavascriptInterface
    public void copyHtml(String html, String plain) {
        onUi(() -> clipboard().setPrimaryClip(ClipData.newHtmlText("html", plain, html)));
    }

    @JavascriptInterface
    public void copyImage(String src) {
        onUi(() -> clipboard().setPrimaryClip(ClipData.newUri(activity.getContentResolver(), "image", imageUri(src))));
    }

    @JavascriptInterface
    public void shareText(String text, String title) {
        onUi(() -> {
            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType("text/plain");
            intent.putExtra(Intent.EXTRA_TEXT, text);
            intent.putExtra(Intent.EXTRA_SUBJECT, title);
            share(intent, title);
        });
    }

    @JavascriptInterface
    public void shareImage(String src, String title) {
        onUi(() -> {
            Intent intent = new Intent(Intent.ACTION_SEND);
            intent.setType(imageMime(src));
            intent.putExtra(Intent.EXTRA_STREAM, imageUri(src));
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
            share(intent, title);
        });
    }

    private void share(Intent intent, String title) {
        activity.startActivity(Intent.createChooser(intent, title));
    }

    private ClipboardManager clipboard() {
        return (ClipboardManager) activity.getSystemService(Context.CLIPBOARD_SERVICE);
    }

    private String imageMime(String src) {
        int comma = src.indexOf(',');
        String type = src.substring(5, comma).split(";")[0];
        return type.isEmpty() ? "image/png" : type;
    }

    private Uri imageUri(String src) {
        int comma = src.indexOf(',');
        String type = imageMime(src);
        String ext = type.contains("jpeg") || type.contains("jpg") ? "jpg" : "png";
        File file = new File(activity.getCacheDir(), "clipboard." + ext);
        byte[] data = Base64.decode(src.substring(comma + 1), Base64.DEFAULT);
        try (FileOutputStream out = new FileOutputStream(file)) {
            out.write(data);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return FileProvider.getUriForFile(activity, activity.getPackageName() + ".fileprovider", file);
    }

    private void onUi(Runnable action) {
        activity.runOnUiThread(action);
    }
}
