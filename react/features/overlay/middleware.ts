/* eslint-disable lines-around-comment */

import { IStore } from '../app/types';
import { JitsiConferenceErrors } from '../base/lib-jitsi-meet';
import {
    getFatalError,
    isFatalJitsiConferenceError,
    isFatalJitsiConnectionError
} from '../base/lib-jitsi-meet/functions.any';
import StateListenerRegistry from '../base/redux/StateListenerRegistry';

import { fatalError } from './actions';


/**
 * Error type. Basically like Error, but augmented with a recoverable property.
 */
type ErrorType = {

    /**
     * Error message.
     */
    message?: string;

    /**
     * Error name.
     */
    name: string;

    /**
     * Indicates whether this event is recoverable or not.
     */
    recoverable?: boolean;
};

/**
 * List of errors that are not fatal (or handled differently) so then the overlays won't kick in.
 */
const NON_OVERLAY_ERRORS = [
    JitsiConferenceErrors.CONFERENCE_ACCESS_DENIED,
    JitsiConferenceErrors.CONFERENCE_DESTROYED,
    JitsiConferenceErrors.CONNECTION_ERROR
];

const ERROR_TYPES = {
    CONFIG: 'CONFIG',
    CONNECTION: 'CONNECTION',
    CONFERENCE: 'CONFERENCE'
};

/**
 * Gets the error type and whether it's fatal or not.
 *
 * @param {Function} getState - The redux function for fetching the current state.
 * @param {Object|string} error - The error to process.
 * @returns {void}
 */
const getErrorExtraInfo = (getState: IStore['getState'], error: ErrorType) => {
    const state = getState();
    const {
        conferenceError,
        configError,
        connectionError
    } = getFatalError(state);

    if (error === conferenceError) {
        return {
            type: ERROR_TYPES.CONFERENCE, // @ts-ignore
            isFatal: isFatalJitsiConferenceError(error.name || error)
        };
    }

    if (error === configError) {
        return {
            type: ERROR_TYPES.CONFIG,
            isFatal: true
        };
    }

    if (error === connectionError) {
        return {
            type: ERROR_TYPES.CONNECTION, // @ts-ignore
            isFatal: isFatalJitsiConnectionError(error.name || error)
        };
    }
};

/**
 * State listener which emits the {@code fatalErrorOccurred} action which works
 * as a catch all for critical errors which have not been claimed by any other
 * feature for error recovery (the recoverable flag is not set).
 */
StateListenerRegistry.register(
    /* selector */ state => {
        const {
            conferenceError,
            configError,
            connectionError
        } = getFatalError(state);

        return configError || connectionError || conferenceError;
    },
    /* listener */ (error: ErrorType, { dispatch, getState }) => {
        const { isFatal } = getFatalError(getState);

        if (!error) {
            return;
        }

        // eslint-disable-next-line no-negated-condition
        if (typeof APP !== 'undefined') {
            APP.API.notifyError({
                ...error,
                ...getErrorExtraInfo(getState, error)
            });
        } else {
            // @ts-ignore
            dispatch(fatalError(isFatal));
        }

        if (NON_OVERLAY_ERRORS.indexOf(error.name) === -1 && typeof error.recoverable === 'undefined') {
            // @ts-ignore
            dispatch(fatalError(isFatal));
        }
    }
);
