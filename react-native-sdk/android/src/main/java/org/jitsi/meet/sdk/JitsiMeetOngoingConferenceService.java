/*
 * Copyright @ 2019-present 8x8, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.jitsi.meet.sdk;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.IBinder;

import androidx.localbroadcastmanager.content.LocalBroadcastManager;

import org.jitsi.meet.sdk.log.JitsiMeetLogger;

import java.util.HashMap;

/**
 * This class implements an Android {@link Service}, a foreground one specifically, and it's
 * responsible for presenting an ongoing notification when a conference is in progress.
 * The service will help keep the app running while in the background.
 *
 * See: https://developer.android.com/guide/components/services
 */
public class JitsiMeetOngoingConferenceService extends Service
    implements RNOngoingConferenceTracker.OngoingConferenceListener {
    private static final String TAG = JitsiMeetOngoingConferenceService.class.getSimpleName();
    private static final String EXTRA_DATA_KEY = "extraDataKey";
    private static final String EXTRA_DATA_BUNDLE_KEY = "extraDataBundleKey";
    private static final String IS_AUDIO_MUTED_KEY = "isAudioMuted";

    private final BroadcastReceiver broadcastReceiver = new BroadcastReceiver();

    private boolean isAudioMuted;

    @Override
    public void onCreate() {
        super.onCreate();

        Notification notification = RNOngoingNotification.buildOngoingConferenceNotification(isAudioMuted);
        if (notification == null) {
            stopSelf();
            JitsiMeetLogger.w(TAG + " Couldn't start service, notification is null");
        } else {
            startForeground(RNOngoingNotification.NOTIFICATION_ID, notification);
            JitsiMeetLogger.i(TAG + " Service started");
        }

        RNOngoingConferenceTracker.getInstance().addListener(this);

        IntentFilter intentFilter = new IntentFilter();
        intentFilter.addAction(BroadcastEvent.Type.AUDIO_MUTED_CHANGED.getAction());
        LocalBroadcastManager.getInstance(getApplicationContext()).registerReceiver(broadcastReceiver, intentFilter);
    }

    @Override
    public void onDestroy() {
        RNOngoingConferenceTracker.getInstance().removeListener(this);
        LocalBroadcastManager.getInstance(getApplicationContext()).unregisterReceiver(broadcastReceiver);

        super.onDestroy();
    }

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        Boolean isAudioMuted = tryParseIsAudioMuted(intent);

        if (isAudioMuted != null) {
            this.isAudioMuted = Boolean.parseBoolean(intent.getStringExtra("muted"));

            Notification notification = RNOngoingNotification.buildOngoingConferenceNotification(isAudioMuted);
            if (notification == null) {
                stopSelf();
                JitsiMeetLogger.w(TAG + " Couldn't start service, notification is null");
            } else {
                NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                notificationManager.notify(RNOngoingNotification.NOTIFICATION_ID, notification);
            }
        }

        final String actionName = intent.getAction();
        final Action action = Action.fromName(actionName);

        // When starting the service, there is no action passed in the intent
        if (action != null) {
            switch (action) {
                case UNMUTE:
                case MUTE:
                    Intent muteBroadcastIntent = BroadcastIntentHelper.buildSetAudioMutedIntent(action == Action.MUTE);
                    LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(muteBroadcastIntent);
                    break;
                case HANGUP:
                    JitsiMeetLogger.i(TAG + " Hangup requested");

                    Intent hangupBroadcastIntent = BroadcastIntentHelper.buildHangUpIntent();
                    LocalBroadcastManager.getInstance(getApplicationContext()).sendBroadcast(hangupBroadcastIntent);

                    stopSelf();
                    break;
                default:
                    JitsiMeetLogger.w(TAG + " Unknown action received: " + action);
                    break;
            }
        }

        return START_NOT_STICKY;
    }

    @Override
    public void onCurrentConferenceChanged(String conferenceUrl) {
        if (conferenceUrl == null) {
            stopSelf();
            RNOngoingNotification.resetStartingtime();
            JitsiMeetLogger.i(TAG + "Service stopped");
        }
    }

    public enum Action {
        HANGUP(TAG + ":HANGUP"),
        MUTE(TAG + ":MUTE"),
        UNMUTE(TAG + ":UNMUTE");

        private final String name;

        Action(String name) {
            this.name = name;
        }

        public static Action fromName(String name) {
            for (Action action : Action.values()) {
                if (action.name.equalsIgnoreCase(name)) {
                    return action;
                }
            }
            return null;
        }

        public String getName() {
            return name;
        }
    }

    private Boolean tryParseIsAudioMuted(Intent intent) {
        try {
            HashMap<String, Object> extraData = (HashMap<String, Object>) intent.getBundleExtra(EXTRA_DATA_BUNDLE_KEY).getSerializable(EXTRA_DATA_KEY);
            return Boolean.parseBoolean((String) extraData.get(IS_AUDIO_MUTED_KEY));
        } catch (Exception ignored) {
        }
        return null;
    }

    private class BroadcastReceiver extends android.content.BroadcastReceiver {

        @Override
        public void onReceive(Context context, Intent intent) {
            isAudioMuted = Boolean.parseBoolean(intent.getStringExtra("muted"));
            Notification notification = RNOngoingNotification.buildOngoingConferenceNotification(isAudioMuted);
            if (notification == null) {
                stopSelf();
                JitsiMeetLogger.w(TAG + " Couldn't update service, notification is null");
            } else {
                NotificationManager notificationManager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
                notificationManager.notify(RNOngoingNotification.NOTIFICATION_ID, notification);

                JitsiMeetLogger.i(TAG + " audio muted changed");
            }
        }
    }
}
