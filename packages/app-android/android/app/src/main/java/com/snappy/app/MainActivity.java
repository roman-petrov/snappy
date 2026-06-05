package com.snappy.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.activity.ComponentActivity;
import androidx.activity.EdgeToEdge;
import androidx.activity.OnBackPressedCallback;
import androidx.activity.SystemBarStyle;
import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.core.content.ContextCompat;

public class MainActivity extends ComponentActivity {

    private WebView webView;
    private Bridge bridge;
    private AppHost appHost;
    private PermissionRequest pendingPermissionRequest;

    private final ActivityResultLauncher<String> microphonePermissionLauncher =
            registerForActivityResult(
                    new ActivityResultContracts.RequestPermission(),
                    granted -> {
                        if (pendingPermissionRequest == null) {
                            return;
                        }
                        if (granted) {
                            pendingPermissionRequest.grant(pendingPermissionRequest.getResources());
                        } else {
                            pendingPermissionRequest.deny();
                        }
                        pendingPermissionRequest = null;
                    });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG);
        EdgeToEdge.enable(
                this,
                SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT),
                SystemBarStyle.light(Color.TRANSPARENT, Color.TRANSPARENT));
        setContentView(R.layout.activity_main);

        View splash = findViewById(R.id.splash);
        ErrorScreen errorScreen = new ErrorScreen(findViewById(R.id.error), splash);
        webView = findViewById(R.id.webview);
        webView.setOverScrollMode(View.OVER_SCROLL_ALWAYS);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        bridge = new Bridge(this, webView);
        webView.addJavascriptInterface(bridge, "Bridge");
        webView.setWebChromeClient(
                new WebChromeClient() {
                    @Override
                    public void onPermissionRequest(final PermissionRequest request) {
                        runOnUiThread(
                                () -> {
                                    if (ContextCompat.checkSelfPermission(
                                                    MainActivity.this,
                                                    Manifest.permission.RECORD_AUDIO)
                                            == PackageManager.PERMISSION_GRANTED) {
                                        request.grant(request.getResources());
                                        return;
                                    }
                                    pendingPermissionRequest = request;
                                    microphonePermissionLauncher.launch(
                                            Manifest.permission.RECORD_AUDIO);
                                });
                    }
                });

        appHost = new AppHost(this, webView, splash, errorScreen, BuildConfig.APP_URL);
        appHost.bind();

        getOnBackPressedDispatcher()
                .addCallback(
                        this,
                        new OnBackPressedCallback(true) {
                            @Override
                            public void handleOnBackPressed() {
                                if (appHost.errorVisible()) {
                                    return;
                                }
                                if (webView.canGoBack()) {
                                    webView.goBack();
                                } else {
                                    setEnabled(false);
                                    getOnBackPressedDispatcher().onBackPressed();
                                }
                            }
                        });
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (bridge == null) {
            return;
        }
        bridge.systemThemeChanged();
    }

    @Override
    protected void onDestroy() {
        if (appHost != null) {
            appHost.destroy();
        }
        super.onDestroy();
    }
}
