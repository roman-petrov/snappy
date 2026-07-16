package com.snappy.app;

import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;

final class AppLink {
    private AppLink() {}

    static String from(Intent intent) {
        if (intent == null || !Intent.ACTION_VIEW.equals(intent.getAction())) {
            return null;
        }
        Uri data = intent.getData();

        return data != null ? data.toString() : null;
    }

    static boolean trusted(String url, String appUrl) {
        if (url == null) {
            return false;
        }
        Uri uri = Uri.parse(url);
        Uri base = Uri.parse(appUrl);
        if (!uri.getScheme().equals(base.getScheme()) || !uri.getHost().equals(base.getHost())) {
            return false;
        }
        String path = uri.getPath();
        if (path == null) {
            return false;
        }

        return path.startsWith("/app") || path.startsWith("/api/auth");
    }

    static boolean inApp(String url, String appUrl) {
        return url != null && !url.equals("about:blank") && trusted(url, appUrl);
    }

    static boolean http(String url) {
        if (url == null) {
            return false;
        }
        String scheme = Uri.parse(url).getScheme();
        return "http".equals(scheme) || "https".equals(scheme);
    }

    static boolean openOutside(Context context, String url) {
        if (url == null) {
            return false;
        }
        Uri uri = Uri.parse(url);
        String scheme = uri.getScheme();
        if (scheme == null || scheme.equals("http") || scheme.equals("https")) {
            return false;
        }
        try {
            context.startActivity(new Intent(Intent.ACTION_VIEW, uri));
        } catch (ActivityNotFoundException ignored) {
        }
        return true;
    }

    static String start(String link, String appUrl) {
        return trusted(link, appUrl) ? link : appUrl;
    }
}
