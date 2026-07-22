package com.snappy.app;

import android.graphics.Color;
import android.view.View;
import androidx.activity.ComponentActivity;
import androidx.activity.EdgeToEdge;
import androidx.activity.SystemBarStyle;
import androidx.core.content.ContextCompat;
import androidx.core.view.ViewCompat;

final class WebChrome {
    private final ComponentActivity activity;
    private final Bridge bridge;
    private final View container;
    private boolean external;

    WebChrome(ComponentActivity activity, View container, Bridge bridge) {
        this.activity = activity;
        this.container = container;
        this.bridge = bridge;
    }

    void setExternal(boolean external) {
        if (this.external == external) {
            return;
        }
        this.external = external;
        if (external) {
            applyExternal();
        } else {
            applyApp();
            bridge.applyBarStyle();
        }
        ViewCompat.requestApplyInsets(container);
    }

    private void applyApp() {
        EdgeToEdge.enable(
                activity,
                SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
                SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT));
    }

    private void applyExternal() {
        int bar = ContextCompat.getColor(activity, R.color.chrome);
        EdgeToEdge.enable(
                activity,
                SystemBarStyle.light(bar, Color.BLACK),
                SystemBarStyle.light(bar, Color.BLACK));
    }
}
