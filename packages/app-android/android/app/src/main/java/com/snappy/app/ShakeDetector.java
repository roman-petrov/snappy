// cspell:word sonification
package com.snappy.app;

import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.VibrationAttributes;
import android.os.VibrationEffect;
import android.os.Vibrator;

final class ShakeDetector implements SensorEventListener {
    private static final float THRESHOLD = 2.7f;
    private static final long DEBOUNCE_MS = 1200L;
    private static final int CLICK_GAP_MS = 50;

    private static final VibrationAttributes SHAKE_ATTRIBUTES =
            new VibrationAttributes.Builder().setUsage(VibrationAttributes.USAGE_TOUCH).build();

    private final Context context;
    private final Sensor accelerometer;
    private final Runnable onShake;
    private final SensorManager sensorManager;
    private long lastShakeAt;

    ShakeDetector(Context context, Runnable onShake) {
        this.context = context;
        this.onShake = onShake;
        sensorManager = (SensorManager) context.getSystemService(Context.SENSOR_SERVICE);
        accelerometer =
                sensorManager == null
                        ? null
                        : sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
    }

    void start() {
        if (sensorManager == null || accelerometer == null) {
            return;
        }
        sensorManager.registerListener(this, accelerometer, SensorManager.SENSOR_DELAY_UI);
    }

    void stop() {
        if (sensorManager == null) {
            return;
        }
        sensorManager.unregisterListener(this);
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != Sensor.TYPE_ACCELEROMETER) {
            return;
        }
        float x = event.values[0] / SensorManager.GRAVITY_EARTH;
        float y = event.values[1] / SensorManager.GRAVITY_EARTH;
        float z = event.values[2] / SensorManager.GRAVITY_EARTH;
        float force = (float) Math.sqrt(x * x + y * y + z * z);
        if (force <= THRESHOLD) {
            return;
        }
        long now = System.currentTimeMillis();
        if (now - lastShakeAt < DEBOUNCE_MS) {
            return;
        }
        lastShakeAt = now;
        vibrate();
        onShake.run();
    }

    private void vibrate() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return;
        }
        Vibrator vibrator = context.getSystemService(Vibrator.class);
        if (vibrator == null || !vibrator.hasVibrator()) {
            return;
        }
        int click = VibrationEffect.Composition.PRIMITIVE_CLICK;
        if (!vibrator.areAllPrimitivesSupported(click)) {
            return;
        }
        VibrationEffect effect =
                VibrationEffect.startComposition()
                        .addPrimitive(click)
                        .addPrimitive(click, 1.0f, CLICK_GAP_MS)
                        .compose();
        vibrator.vibrate(effect, SHAKE_ATTRIBUTES);
    }

    // Required by SensorEventListener; shake detection does not depend on accuracy.
    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}
}
