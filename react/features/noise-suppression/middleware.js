import { distSquared } from '@tensorflow/tfjs-core/dist/util_base';

import { MiddlewareRegistry } from '../base/redux';
import { getLocalJitsiAudioTrack } from '../base/tracks';
import { NOTIFICATION_TIMEOUT_TYPE, showErrorNotification, showWarningNotification } from '../notifications';
import { isScreenAudioShared } from '../screen-share';
import { NoiseSuppressionEffect } from '../stream-effects/noise-suppression/NoiseSuppressionEffect';

import { TOGGLE_NOISE_SUPPRESSION } from './actionTypes';
import { setNoiseSuppressionState } from './actions';
import { isNoiseSuppressionActive } from './functions';
import logger from './logger';

/**
 * Verify if noise suppression can be enabled in the current state.
 *
 * @param {*} state - Redux state.
 * @param {*} dispatch - Redux dispatch.
 * @param {*} localAudio - Current local audio track.
 * @returns {boolean}
 */
function canEnableNoiseSuppression(state, dispatch, localAudio) {
    const { channelCount } = localAudio.track.getSettings();

    // Sharing screen audio implies an effect being applied to the local track, because currently we don't support
    // more then one effect at a time the user has to choose between sharing audio or having noise suppression active.
    if (isScreenAudioShared(state)) {
        dispatch(showWarningNotification({
            titleKey: 'notify.noiseSuppressionFailedTitle',
            descriptionKey: 'notify.noiseSuppressionDesktopAudioDescription'
        }, NOTIFICATION_TIMEOUT_TYPE.MEDIUM));

        return false;
    }

    // Stereo audio tracks aren't currently supported, make sure the current local track is mono
    if (channelCount > 1) {
        dispatch(showWarningNotification({
            titleKey: 'notify.noiseSuppressionFailedTitle',
            descriptionKey: 'notify.noiseSuppressionStereoDescription'
        }, NOTIFICATION_TIMEOUT_TYPE.MEDIUM));

        return false;
    }

    return true;
}

/**
 * Implements middleware for the noise suppression feature.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(({ dispatch, getState }) => next => async action => {
    const result = next(action);

    switch (action.type) {
    case TOGGLE_NOISE_SUPPRESSION: {
        const state = getState();
        const noiseSuppressionActive = isNoiseSuppressionActive(state);
        const localAudio = getLocalJitsiAudioTrack(state);

        if (!localAudio) {
            logger.warn('Can not toggle noise suppression without any local track active.');

            dispatch(showWarningNotification({
                titleKey: 'notify.noiseSuppressionFailedTitle',
                descriptionKey: 'notify.noiseSuppressionNoTrackDescription'
            }, NOTIFICATION_TIMEOUT_TYPE.MEDIUM));

            return result;
        }

        try {
            if (noiseSuppressionActive) {
                await localAudio.setEffect(undefined);
                dispatch(setNoiseSuppressionState(false));
                logger.info('Noise suppression disabled.');
            } else {

                if (!canEnableNoiseSuppression(state, dispatch, localAudio)) {
                    return result;
                }

                await localAudio.setEffect(new NoiseSuppressionEffect());
                dispatch(setNoiseSuppressionState(true));
                logger.info('Noise suppression enabled.');
            }
        } catch (error) {
            logger.error(
                `Failed to toggle noise suppression to active state: ${!noiseSuppressionActive}`,
                error
            );

            dispatch(showErrorNotification({
                titleKey: 'notify.noiseSuppressionFailedTitle'
            }, NOTIFICATION_TIMEOUT_TYPE.MEDIUM));
        }

        break;
    }
    }

    return result;
});

