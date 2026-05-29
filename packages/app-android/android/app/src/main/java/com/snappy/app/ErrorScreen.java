package com.snappy.app;

import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

public final class ErrorScreen {
    private final TextView body;
    private final ImageView icon;
    private final View root;
    private final View splash;
    private final TextView title;
    private final Button retry;

    public ErrorScreen(View root, View splash) {
        this.root = root;
        this.splash = splash;
        icon = root.findViewById(R.id.error_icon);
        title = root.findViewById(R.id.error_title);
        body = root.findViewById(R.id.error_body);
        retry = root.findViewById(R.id.error_retry);
    }

    public void hide() {
        root.setVisibility(View.GONE);
    }

    public void setOnRetry(Runnable action) {
        retry.setOnClickListener(v -> action.run());
    }

    public void show(boolean network) {
        if (network) {
            icon.setImageResource(R.drawable.error_network);
            title.setText(R.string.error_network_title);
            body.setText(R.string.error_network_body);
        } else {
            icon.setImageResource(R.drawable.error_load);
            title.setText(R.string.error_load_title);
            body.setText(R.string.error_load_body);
        }
        splash.setVisibility(View.GONE);
        root.setVisibility(View.VISIBLE);
    }

    public boolean visible() {
        return root.getVisibility() == View.VISIBLE;
    }
}
