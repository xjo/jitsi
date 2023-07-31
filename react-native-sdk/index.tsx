/* eslint-disable lines-around-comment,  no-undef, no-unused-vars  */

import 'react-native-gesture-handler';
// Apply all necessary polyfills as early as possible
// to make sure anything imported henceforth sees them.
import 'react-native-get-random-values';
import './react/features/mobile/polyfills';

import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { View, ViewStyle } from 'react-native';

import { appNavigate } from './react/features/app/actions.native';
import { App } from './react/features/app/components/App.native';
import { setAudioMuted, setVideoMuted } from './react/features/base/media/actions';
import JitsiThemePaperProvider from './react/features/base/ui/components/JitsiThemeProvider.native';


interface IUserInfo {
    avatarURL: string;
    displayName: string;
    email: string;
}

interface IAppProps {
    config: object;
    flags: object;
    eventListeners: {
        onReadyToClose?: Function;
        onConferenceJoined?: Function;
        onConferenceWillJoin?: Function;
        onConferenceLeft?: Function;
        onParticipantJoined?: Function;
    };
    room: string;
    serverURL?: string;
    token?: string;
    userInfo?: IUserInfo;
    style?: Object;
}

/**
 * Main React Native SDK component that displays a Jitsi Meet conference and gets all required params as props
 */
export const JitsiMeeting = forwardRef((props: IAppProps, ref) => {
    const [ appProps, setAppProps ] = useState({});
    const app = useRef(null);
    const {
        config,
        eventListeners,
        flags,
        room,
        serverURL,
        style,
        token,
        userInfo
    } = props;

    // eslint-disable-next-line arrow-body-style
    useImperativeHandle(ref, () => ({
        close: () => {
            const dispatch = app.current.state.store.dispatch;

            dispatch(appNavigate(undefined));
        },
        setAudioMuted: muted => {
            const dispatch = app.current.state.store.dispatch;

            dispatch(setAudioMuted(muted));
        },
        setVideoMuted: muted => {
            const dispatch = app.current.state.store.dispatch;

            dispatch(setVideoMuted(muted));
        }
    }));

    useEffect(
        () => {
            const url = {
                config,
                jwt: token,
                room: room.includes('://') ? undefined : room,
                serverURL: room.includes('://') ? undefined : serverURL,
                url: room.includes('://') ? room : undefined
            };


            setAppProps({
                'flags': flags,
                'rnSdkHandlers': {
                    onReadyToClose: eventListeners.onReadyToClose,
                    onConferenceJoined: eventListeners.onConferenceJoined,
                    onConferenceWillJoin: eventListeners.onConferenceWillJoin,
                    onConferenceLeft: eventListeners.onConferenceLeft,
                    onParticipantJoined: eventListeners.onParticipantJoined
                },
                'url': url,
                'userInfo': userInfo
            });
        }, []
    );

    return (
        <View style = { style as ViewStyle }>
            <JitsiThemePaperProvider>
                <App
                    { ...appProps }
                    ref = { app } />
            </JitsiThemePaperProvider>
        </View>
    );
});
