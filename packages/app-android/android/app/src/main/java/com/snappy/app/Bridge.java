package com.snappy.app;

import android.view.View;
import android.webkit.JavascriptInterface;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class Bridge {

    private final MainActivity activity;

    public Bridge(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public void setBarStyle(String theme) {
        activity.runOnUiThread(() -> {
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
        activity.runOnUiThread(() -> {
            View view = activity.getWindow().getDecorView();
            view.performHapticFeedback(constant);
        });
    }
}
