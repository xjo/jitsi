import { NativeModules } from 'react-native';

import { getAppProp } from '../../base/app/functions';
import {
    CONFERENCE_BLURRED,
    CONFERENCE_FOCUSED,
    CONFERENCE_JOINED,
    CONFERENCE_LEFT,
    CONFERENCE_WILL_JOIN
} from '../../base/conference/actionTypes';
import { PARTICIPANT_JOINED } from '../../base/participants/actionTypes';
import MiddlewareRegistry from '../../base/redux/MiddlewareRegistry';
import { READY_TO_CLOSE } from '../external-api/actionTypes';
import { participantToParticipantInfo } from '../external-api/functions';
import { ENTER_PICTURE_IN_PICTURE } from '../picture-in-picture/actionTypes';

import { isExternalAPIAvailable } from './functions';

const externalAPIEnabled = isExternalAPIAvailable();
const { JMOngoingConference } = NativeModules;


/**
 * Check if native modules are being used or not. If not then the init of middleware doesn't happen.
 */
!externalAPIEnabled && MiddlewareRegistry.register(store => next => action => {
    const result = next(action);
    const { type } = action;
    const rnSdkHandlers = getAppProp(store, 'rnSdkHandlers');

    switch (type) {
    case CONFERENCE_BLURRED:
        rnSdkHandlers?.onConferenceBlurred && rnSdkHandlers?.onConferenceBlurred();
        break;
    case CONFERENCE_FOCUSED:
        rnSdkHandlers?.onConferenceFocused && rnSdkHandlers?.onConferenceFocused();
        break;
    case CONFERENCE_JOINED:
        JMOngoingConference?.launchNotification();
        rnSdkHandlers?.onConferenceJoined && rnSdkHandlers?.onConferenceJoined();
        break;
    case CONFERENCE_LEFT:
        JMOngoingConference?.destroyNotification();
        //  Props are torn down at this point, perhaps need to leave this one out
        break;
    case CONFERENCE_WILL_JOIN:
        JMOngoingConference?.createNotification();
        rnSdkHandlers?.onConferenceWillJoin && rnSdkHandlers?.onConferenceWillJoin();
        break;
    case ENTER_PICTURE_IN_PICTURE:
        rnSdkHandlers?.onEnterPictureInPicture && rnSdkHandlers?.onEnterPictureInPicture();
        break;
    case PARTICIPANT_JOINED: {
        const { participant } = action;
        const participantInfo = participantToParticipantInfo(participant);

        rnSdkHandlers?.onParticipantJoined && rnSdkHandlers?.onParticipantJoined(participantInfo);
        break;
    }
    case READY_TO_CLOSE:
        JMOngoingConference?.abortNotification();
        rnSdkHandlers?.onReadyToClose && rnSdkHandlers?.onReadyToClose();
        break;
    }

    return result;
}
);
