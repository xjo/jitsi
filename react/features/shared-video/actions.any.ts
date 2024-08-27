import { IStore } from '../app/types';
import { getCurrentConference } from '../base/conference/functions';
import { openDialog } from '../base/dialog/actions';
import { getLocalParticipant } from '../base/participants/functions';

import {
    RESET_SHARED_VIDEO_STATUS,
    SET_ALLOWED_URL_DOMAINS, SET_DIALOG_IN_PROGRESS,
    SET_DIALOG_SHOWN,
    SET_SHARED_VIDEO_STATUS
} from './actionTypes';
import { ShareVideoConfirmDialog, SharedVideoDialog } from './components';
import { isSharedVideoEnabled } from './functions';


/**
 * Marks dialog is in progress.
 *
 * @param {boolean} value - The value to set.
 * @returns {{
 *     type: SET_DIALOG_IN_PROGRESS,
 * }}
 */
export function setDialogInProgress(value: boolean) {
    return {
        type: SET_DIALOG_IN_PROGRESS,
        value
    };
}

/**
 * Marks that dialog was shown.
 *
 * @returns {{
 *     type: SET_DIALOG_SHOWN,
 * }}
 */
export function setDialogShown() {
    return {
        type: SET_DIALOG_SHOWN
    };
}

/**
 * Resets the status of the shared video.
 *
 * @returns {{
 *     type: SET_SHARED_VIDEO_STATUS,
 * }}
 */
export function resetSharedVideoStatus() {
    return {
        type: RESET_SHARED_VIDEO_STATUS
    };
}

/**
 * Updates the current known status of the shared video.
 *
 * @param {Object} options - The options.
 * @param {boolean} options.muted - Is video muted.
 * @param {boolean} options.ownerId - Participant ID of the owner.
 * @param {boolean} options.status - Sharing status.
 * @param {boolean} options.time - Playback timestamp.
 * @param {boolean} options.videoUrl - URL of the shared video.
 *
 * @returns {{
 *     type: SET_SHARED_VIDEO_STATUS,
 *     muted: boolean,
 *     ownerId: string,
 *     status: string,
 *     time: number,
 *     videoUrl: string,
 * }}
 */
export function setSharedVideoStatus({ videoUrl, status, time, ownerId, muted }: {
    muted?: boolean; ownerId?: string; status: string; time: number; videoUrl: string;
}) {
    return {
        type: SET_SHARED_VIDEO_STATUS,
        ownerId,
        status,
        time,
        videoUrl,
        muted
    };
}

/**
 * Displays the dialog for entering the video link.
 *
 * @param {Function} onPostSubmit - The function to be invoked when a valid link is entered.
 * @returns {Function}
 */
export function showSharedVideoDialog(onPostSubmit: Function) {
    return openDialog(SharedVideoDialog, { onPostSubmit });
}

/**
 *
 * Stops playing a shared video.
 *
 * @returns {Function}
 */
export function stopSharedVideo() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { ownerId } = state['features/shared-video'];
        const localParticipant = getLocalParticipant(state);

        if (ownerId === localParticipant?.id) {
            dispatch(resetSharedVideoStatus());
        }
    };
}

/**
 *
 * Plays a shared video.
 *
 * @param {string} videoUrl - The video url to be played.
 *
 * @returns {Function}
 */
export function playSharedVideo(videoUrl: string) {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        if (!isSharedVideoEnabled(getState())) {
            return;
        }
        const conference = getCurrentConference(getState());

        if (conference) {
            const localParticipant = getLocalParticipant(getState());

            dispatch(setSharedVideoStatus({
                videoUrl,
                status: 'start',
                time: 0,
                ownerId: localParticipant?.id
            }));
        }
    };
}

/**
 *
 * Stops playing a shared video.
 *
 * @returns {Function}
 */
export function toggleSharedVideo() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const state = getState();
        const { status = '' } = state['features/shared-video'];

        if ([ 'playing', 'start', 'pause' ].includes(status)) {
            dispatch(stopSharedVideo());
        } else {
            dispatch(showSharedVideoDialog((id: string) => dispatch(playSharedVideo(id))));
        }
    };
}

/**
 * Sets the allowed URL domains of the shared video.
 *
 * @param {Array<string>} allowedUrlDomains - The new whitelist to be set.
 * @returns {{
 *     type: SET_ALLOWED_URL_DOMAINS,
 *     allowedUrlDomains: Array<string>
 * }}
 */
export function setAllowedUrlDomians(allowedUrlDomains: Array<string>) {
    return {
        type: SET_ALLOWED_URL_DOMAINS,
        allowedUrlDomains
    };
}

/**
 * Shows a confirmation dialog whether to play the external video link.
 *
 * @param {string} actor - The actor's name.
 * @param {Function} onSubmit - The function to execute when confirmed.
 *
 * @returns {Function}
 */
export function showConfirmPlayingDialog(actor: String, onSubmit: Function) {
    return (dispatch: IStore['dispatch']) => {
        dispatch(setDialogInProgress(true));
        dispatch(setDialogShown());
        dispatch(openDialog(ShareVideoConfirmDialog, {
            actorName: actor,
            onCancel: () => dispatch(setDialogInProgress(false)),
            onSubmit: () => onSubmit()
        }));
    };
}
