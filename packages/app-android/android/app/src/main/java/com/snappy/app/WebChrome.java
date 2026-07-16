package com.snappy.app;

import android.graphics.Color;
import android.view.View;
import androidx.activity.ComponentActivity;
import androidx.activity.EdgeToEdge;
import androidx.activity.SystemBarStyle;
import androidx.core.content.ContextCompat;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

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

    WindowInsetsCompat applyInsets(View view, WindowInsetsCompat windowInsets) {
        Insets ime = windowInsets.getInsets(WindowInsetsCompat.Type.ime());
        view.setPadding(0, 0, 0, ime.bottom);
        bridge.keyboardChanged(ime.bottom > 0);
        return new WindowInsetsCompat.Builder(windowInsets)
                .setInsets(WindowInsetsCompat.Type.ime(), Insets.NONE)
                .build();
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
