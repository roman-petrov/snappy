package com.snappy.app;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.view.View;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
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
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class MainActivity extends ComponentActivity {

    private WebView webView;
    private Bridge bridge;
    private AppHost appHost;
    private PermissionRequest pendingPermissionRequest;
    private ValueCallback<Uri[]> filePathCallback;

    private final ActivityResultLauncher<Intent> fileChooserLauncher =
            registerForActivityResult(
                    new ActivityResultContracts.StartActivityForResult(),
                    result -> {
                        if (filePathCallback == null) {
                            return;
                        }
                        Uri[] uris = null;
                        if (result.getResultCode() == Activity.RESULT_OK
                                && result.getData() != null) {
                            Intent data = result.getData();
                            ClipData clipData = data.getClipData();
                            if (clipData != null) {
                                uris = new Uri[clipData.getItemCount()];
                                for (int i = 0; i < clipData.getItemCount(); i++) {
                                    uris[i] = clipData.getItemAt(i).getUri();
                                }
                            } else if (data.getData() != null) {
                                uris = new Uri[] {data.getData()};
                            }
                        }
                        filePathCallback.onReceiveValue(uris);
                        filePathCallback = null;
                    });

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

        View container = findViewById(R.id.webview_container);
        ViewCompat.setOnApplyWindowInsetsListener(
                container,
                (view, windowInsets) -> {
                    Insets ime = windowInsets.getInsets(WindowInsetsCompat.Type.ime());
                    view.setPadding(0, 0, 0, ime.bottom);
                    bridge.keyboardChanged(ime.bottom > 0);
                    return new WindowInsetsCompat.Builder(windowInsets)
                            .setInsets(WindowInsetsCompat.Type.ime(), Insets.NONE)
                            .build();
                });
        webView.setWebChromeClient(
                new WebChromeClient() {
                    @Override
                    public boolean onShowFileChooser(
                            WebView view, ValueCallback<Uri[]> callback, FileChooserParams params) {
                        if (filePathCallback != null) {
                            filePathCallback.onReceiveValue(null);
                        }
                        filePathCallback = callback;
                        try {
                            fileChooserLauncher.launch(params.createIntent());
                        } catch (ActivityNotFoundException e) {
                            filePathCallback = null;
                            return false;
                        }
                        return true;
                    }

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
