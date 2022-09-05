import { IAnalyticsState } from '../analytics/reducer';
import { IAuthenticationState } from '../authentication/reducer';
import { IAVModerationState } from '../av-moderation/reducer';
import { IAppState } from '../base/app/reducer';
import { IAudioOnlyState } from '../base/audio-only/reducer';
import { IConferenceState } from '../base/conference/reducer';
import { IConfigState } from '../base/config/reducer';
import { IConnectionState } from '../base/connection/reducer';
import { IDevicesState } from '../base/devices/reducer';
import { IDialogState } from '../base/dialog/reducer';
import { IFlagsState } from '../base/flags/reducer';
import { IJwtState } from '../base/jwt/reducer';
import { IKnownDomainsState } from '../base/known-domains/reducer';
import { ILastNState } from '../base/lastn/reducer';
import { ILibJitsiMeetState } from '../base/lib-jitsi-meet/reducer';
import { ILoggingState } from '../base/logging/reducer';
import { IMediaState } from '../base/media/reducer';
import { INetInfoState } from '../base/net-info/reducer';
import { IParticipantsState } from '../base/participants/reducer';
import { IResponsiveUIState } from '../base/responsive-ui/reducer';
import { ISettingsState } from '../base/settings/reducer';
import { ISoundsState } from '../base/sounds/reducer';
import { ITestingState } from '../base/testing/reducer';
import { INoSrcDataState, ITracksState } from '../base/tracks/reducer';
import { IUserInteractionState } from '../base/user-interaction/reducer';
import { IBreakoutRoomsState } from '../breakout-rooms/reducer';
import { ICalendarSyncState } from '../calendar-sync/reducer';
import { IChatState } from '../chat/reducer';
import { IDeepLinkingState } from '../deep-linking/reducer';
import { IDropboxState } from '../dropbox/reducer';
import { IDynamicBrandingState } from '../dynamic-branding/reducer';
import { IE2EEState } from '../e2ee/reducer';
import { IEtherpadState } from '../etherpad/reducer';
import { IFaceLandmarksState } from '../face-landmarks/reducer';
import { IFeedbackState } from '../feedback/reducer';
import { IFilmstripState } from '../filmstrip/reducer';
import { IFollowMeState } from '../follow-me/reducer';
import { IGifsState } from '../gifs/reducer';
import { IGoogleApiState } from '../google-api/reducer';
import { IInviteState } from '../invite/reducer';
import { IJaaSState } from '../jaas/reducer';
import { ILargeVideoState } from '../large-video/reducer';
import { ILobbyState } from '../lobby/reducer';
import { IMobileAudioModeState } from '../mobile/audio-mode/reducer';
import { IBackgroundState } from '../mobile/background/reducer';
import { ICallIntegrationState } from '../mobile/call-integration/reducer';
import { IMobileExternalApiState } from '../mobile/external-api/reducer';
import { IFullScreenState } from '../mobile/full-screen/reducer';
import { IMobileWatchOSState } from '../mobile/watchos/reducer';
import { INoAudioSignalState } from '../no-audio-signal/reducer';
import { INoiseDetectionState } from '../noise-detection/reducer';
import { INoiseSuppressionState } from '../noise-suppression/reducer';
import { INotificationsState } from '../notifications/reducer';
import { IOverlayState } from '../overlay/reducer';
import { IPollsState } from '../polls/reducer';
import { IPowerMonitorState } from '../power-monitor/reducer';
import { IPrejoinState } from '../prejoin/reducer';
import { IReactionsState } from '../reactions/reducer';
import { IRecentListState } from '../recent-list/reducer';
import { IRecordingState } from '../recording/reducer';
import { IRemoteControlState } from '../remote-control/reducer';
import { IScreenShareState } from '../screen-share/reducer';
import { IScreenshotCaptureState } from '../screenshot-capture/reducer';
import { ISharedVideoState } from '../shared-video/reducer';
import { ISpeakerStatsState } from '../speaker-stats/reducer';
import { ISubtitlesState } from '../subtitles/reducer';
import { ITalkWhileMutedState } from '../talk-while-muted/reducer';
import { IToolboxState } from '../toolbox/reducer';
import { ITranscribingState } from '../transcribing/reducer';
import { IVideoLayoutState } from '../video-layout/reducer';
import { IVideoQualityPersistedState, IVideoQualityState } from '../video-quality/reducer';
import { IVideoSipGW } from '../videosipgw/reducer';
import { IVirtualBackground } from '../virtual-background/reducer';

export type IStateful = Function | IStore | IState;

export interface IStore {
    dispatch: Function,
    getState: () => IState;
}

export interface IState {
    'features/analytics': IAnalyticsState,
    'features/authentication': IAuthenticationState,
    'features/av-moderation': IAVModerationState,
    'features/background': IBackgroundState,
    'features/base/app': IAppState,
    'features/base/audio-only': IAudioOnlyState,
    'features/base/conference': IConferenceState,
    'features/base/config': IConfigState,
    'features/base/connection': IConnectionState,
    'features/base/devices': IDevicesState,
    'features/base/dialog': IDialogState,
    'features/base/flags': IFlagsState,
    'features/base/jwt': IJwtState,
    'features/base/known-domains': IKnownDomainsState,
    'features/base/lastn': ILastNState,
    'features/base/lib-jitsi-meet': ILibJitsiMeetState,
    'features/base/logging': ILoggingState,
    'features/base/media': IMediaState,
    'features/base/net-info': INetInfoState,
    'features/base/no-src-data': INoSrcDataState,
    'features/base/participants': IParticipantsState,
    'features/base/responsive-ui': IResponsiveUIState,
    'features/base/settings': ISettingsState,
    'features/base/sounds': ISoundsState,
    'features/base/tracks': ITracksState,
    'features/base/user-interaction': IUserInteractionState,
    'features/breakout-rooms': IBreakoutRoomsState,
    'features/calendar-sync': ICalendarSyncState,
    'features/call-integration': ICallIntegrationState,
    'features/chat': IChatState,
    'features/deep-linking': IDeepLinkingState,
    'features/dropbox': IDropboxState,
    'features/dynamic-branding': IDynamicBrandingState,
    'features/e2ee': IE2EEState,
    'features/etherpad': IEtherpadState,
    'features/face-landmarks': IFaceLandmarksState,
    'features/feedback': IFeedbackState,
    'features/filmstrip': IFilmstripState,
    'features/follow-me': IFollowMeState,
    'features/full-screen': IFullScreenState,
    'features/gifs': IGifsState,
    'features/google-api': IGoogleApiState,
    'features/invite': IInviteState,
    'features/jaas': IJaaSState,
    'features/large-video': ILargeVideoState,
    'features/lobby': ILobbyState,
    'features/mobile/audio-mode': IMobileAudioModeState,
    'features/mobile/external-api': IMobileExternalApiState,
    'features/mobile/watchos': IMobileWatchOSState,
    'features/no-audio-signal': INoAudioSignalState,
    'features/noise-detection': INoiseDetectionState,
    'features/noise-suppression': INoiseSuppressionState,
    'features/notifications': INotificationsState,
    'features/overlay': IOverlayState,
    'features/participants-pane': IParticipantsState,
    'features/polls': IPollsState,
    'features/power-monitor': IPowerMonitorState,
    'features/prejoin': IPrejoinState,
    'features/reactions': IReactionsState,
    'features/recent-list': IRecentListState,
    'features/recording': IRecordingState,
    'features/remote-control': IRemoteControlState,
    'features/screen-share': IScreenShareState,
    'features/screenshot-capture': IScreenshotCaptureState,
    'features/settings': ISettingsState,
    'features/shared-video': ISharedVideoState,
    'features/speaker-stats': ISpeakerStatsState,
    'features/subtitles': ISubtitlesState,
    'features/talk-while-muted': ITalkWhileMutedState,
    'features/testing': ITestingState,
    'features/toolbox': IToolboxState,
    'features/transcribing': ITranscribingState,
    'features/video-layout': IVideoLayoutState,
    'features/video-quality': IVideoQualityState,
    'features/video-quality-persistent-storage': IVideoQualityPersistedState,
    'features/videosipgw': IVideoSipGW,
    'features/virtual-background': IVirtualBackground
}
