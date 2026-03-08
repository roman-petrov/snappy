package com.snappy.app;

import android.webkit.JavascriptInterface;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;

public class BarStyleBridge {

    private final MainActivity activity;

    public BarStyleBridge(MainActivity activity) {
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
}
