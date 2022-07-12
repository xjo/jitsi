import { getCurrentConference } from '../base/conference';
import { getLocalParticipant } from '../base/participants';

import {
    RESET_SHARED_IFRAME_STATUS,
    SET_DISABLE_SHARED_IFRAME_BUTTON,
    SET_SHARED_IFRAME_STATUS
} from './actionTypes';

/**
 * Resets the status of the shared iframe.
 *
 * @param {string} shareKey - The key for which the IFrame should be reset.
 * @returns {{
 *     type: RESET_SHARED_IFRAME_STATUS,
 * }}
 */
export function resetSharedIFrameStatus(shareKey) {
    return {
        type: RESET_SHARED_IFRAME_STATUS,
        shareKey
    };
}

/**
 * Updates the current known status of the shared iframe.
 *
 * @param {Object} options - The options.
 * @param {boolean} options.ownerId - Participant ID of the owner.
 * @param {boolean} options.isSharing - Sharing status.
 * @param {boolean} options.iFrameTemplateUrl - URL of the shared iframe.
 *
 * @returns {{
 *     type: SET_SHARED_IFRAME_STATUS,
 *     ownerId: string,
 *     isSharing: boolean,
 *     iFrameTemplateUrl: string,
 * }}
 */
export function setSharedIFrameStatus({ shareKey, iFrameTemplateUrl, isSharing, ownerId }) {
    return {
        type: SET_SHARED_IFRAME_STATUS,
        shareKey,
        ownerId,
        isSharing,
        iFrameTemplateUrl
    };
}

/**
 *
 * Shows the shared IFrame for all participants.
 *
 * @param {string} shareKey - The key of the iframe to be shown.
 *
 * @returns {Function}
 */
export function showSharedIFrame(shareKey) {
    return (dispatch, getState) => {
        const state = getState();
        const conference = getCurrentConference(state);
        const { sharedIFrames } = state['features/base/config'];

        if (conference) {
            const localParticipant = getLocalParticipant(state);

            dispatch(setSharedIFrameStatus({
                shareKey,
                iFrameTemplateUrl: sharedIFrames.frames[shareKey].templateUrl,
                isSharing: 'true',
                ownerId: localParticipant.id
            }));
        }
    };
}

/**
 *
 * Stops sharing of the IFrame.
 *
 * @param {string} shareKey - The key of the iframe to be stopped.
 * @returns {Function}
 */
export function stopSharedIFrame(shareKey) {
    return (dispatch, getState) => {
        const state = getState();
        const { sharedIFrames: sharedIFramesConfig } = state['features/base/config'];

        const localParticipant = getLocalParticipant(state);

        if (state['features/shared-iframe']?.iframes?.[shareKey]?.ownerId === localParticipant.id
            || !sharedIFramesConfig.restrictControlToInitialSharer) {
            dispatch(resetSharedIFrameStatus(shareKey));
        }
    };
}

/**
 *
 * Toggles the shared iframe visibility.
 *
 * @param {string} shareKey - The key of the iframe to be toggled.
 * @returns {Function}
 */
export function toggleSharedIFrame(shareKey) {
    return (dispatch, getState) => {
        const state = getState();

        if (state['features/shared-iframe']?.iframes?.[shareKey]?.isSharing === 'true') {
            dispatch(stopSharedIFrame(shareKey));
        } else {
            dispatch(showSharedIFrame(shareKey));
        }
    };
}

/**
 * Disabled share iframe button.
 *
 * @param {boolean} shareKey - The shareKey of the button to be disabled.
 * @param {boolean} disabled - The current state of the share iframe button.
 * @returns {{
 *     type: SET_DISABLE_SHARED_IFRAME_BUTTON,
 *     disabled: boolean
 * }}
 */
export function setDisableButton(shareKey: string, disabled: boolean) {
    return {
        type: SET_DISABLE_SHARED_IFRAME_BUTTON,
        shareKey,
        disabled
    };
}
