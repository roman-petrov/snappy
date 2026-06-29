package com.snappy.app;

import android.content.Intent;
import android.net.Uri;

final class AppLink {
    private AppLink() {}

    static String origin(String appUrl) {
        Uri uri = Uri.parse(appUrl);

        return uri.getScheme() + "://" + uri.getHost();
    }

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

    static String start(String link, String appUrl) {
        return trusted(link, appUrl) ? link : appUrl;
    }
}
