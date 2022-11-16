package com.nativenotificationstest;

import android.content.Intent;
import android.os.Bundle;
import androidx.annotation.Nullable;
import com.dieam.reactnativepushnotification.modules.RNPushNotification;
import org.json.JSONException;
import org.json.JSONObject;

public class MagicBellIntentHandler implements RNPushNotification.RNIntentHandler {
    @Override
    public void onNewIntent(Intent intent) {
    }

    @Nullable
    @Override
    public Bundle getBundleFromIntent(Intent intent) {
        if (intent.hasExtra("notification")) {
            String serializedNotification = intent.getStringExtra("notification");

            try {
                JSONObject notification = new JSONObject(serializedNotification);

                Bundle dataBundle = new Bundle();
                dataBundle.putBundle("data", intent.getExtras());
                dataBundle.putString("title", notification.getString("title"));
                dataBundle.putString("message", notification.getString("content"));
                return dataBundle;
            } catch (JSONException e) {
                e.printStackTrace();
            }
        }

        return  null;
    }
}